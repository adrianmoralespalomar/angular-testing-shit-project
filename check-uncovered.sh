#!/bin/bash

BASE_BRANCH=HEAD

echo "🧪 Ejecutando tests con cobertura..."
ng test --code-coverage --watch=false > /dev/null

COVERAGE_FILE="coverage/angular-testing-shit-project/lcov.info"
if [ ! -f "$COVERAGE_FILE" ]; then
  echo "❌ No se encontró el archivo de cobertura: $COVERAGE_FILE"
  exit 1
fi

echo "🔍 Analizando cambios respecto a $BASE_BRANCH..."
git diff $BASE_BRANCH --cached --unified=0 -- 'src/**/*.ts' ':(exclude)*.spec.ts'
  awk '
  /^diff --git/ { next }
  /^---/ { next }
  /^\+\+\+ b\// {
    file = substr($0, 7)
    gsub("\\\\", "/", file)
    next
  }
  /^@@/ {
    match($0, /\+([0-9]+)/, m)
    lineno = m[1]
    next
  }
  /^\+/ && !/^\+\+/ {
    print file ":" lineno
    lineno++
    next
  }
  !/^\+/ { lineno++ }
' > .changed_lines.tmp

echo "📊 Comprobando líneas no cubiertas:"
echo "----------------------------------"

EXIT_CODE=0

while IFS= read -r line; do
  FILE=$(echo "$line" | cut -d: -f1)
  LINE_NUM=$(echo "$line" | cut -d: -f2)

  # Normaliza la ruta (quita ./ al inicio, y convierte / y \ en una forma comparable)
  FILE_NORMALIZED=$(echo "$FILE" | sed 's/^\.\/\?//' | sed 's/\//\\\\/g')

  FOUND_LINE=$(awk -v file="$FILE_NORMALIZED" -v line="$LINE_NUM" '
    function normalize(s) {
      gsub("\\\\", "/", s)
      return s
    }
    BEGIN {
      current_file = ""
      is_target_file = 0
      matched = 0
    }
    /^SF:/ {
      current_file = normalize(substr($0, 4))
      is_target_file = (current_file ~ normalize(file))
    }
    is_target_file && /^DA:/ {
      split($0, parts, "[:,]")
      if (parts[2] == line) {
        matched = 1
        if (parts[3] == "0") {
          print "❌ " file ":" line
        }
        exit
      }
    }
    END {
      if (is_target_file && matched == 0) {
        print "❌ " file ":" line
      }
    }
  ' "$COVERAGE_FILE")

  if [[ "$FOUND_LINE" == ❌* ]]; then
    echo "$FOUND_LINE"
    EXIT_CODE=1
  fi

done < .changed_lines.tmp

echo "🔧 Líneas detectadas:"
cat .changed_lines.tmp

rm -f .changed_lines.tmp
exit $EXIT_CODE
