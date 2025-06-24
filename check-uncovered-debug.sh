#!/bin/bash

BASE_BRANCH=HEAD
COVERAGE_FILE="coverage/angular-testing-shit-project/lcov.info"

echo "🧪 Ejecutando tests con cobertura..."
ng test --code-coverage --watch=false > /dev/null

if [ ! -f "$COVERAGE_FILE" ]; then
  echo "❌ No se encontró el archivo de cobertura: $COVERAGE_FILE"
  exit 1
fi

echo "🔍 Extrayendo líneas nuevas staged en 'src/**/*.ts'..."
git diff $BASE_BRANCH --cached --unified=0 -- 'src/**/*.ts' |
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
    print file ":" lineno ":" substr($0,2)
    lineno++
    next
  }
  !/^\+/ { lineno++ }
' > .changed_lines.tmp

echo "Líneas añadidas detectadas (archivo:línea:contenido):"
cat .changed_lines.tmp
echo

echo "🔍 Comprobando cobertura para esas líneas..."
while IFS= read -r line; do
  FILE=$(echo "$line" | cut -d: -f1)
  LINE_NUM=$(echo "$line" | cut -d: -f2)
  CONTENT=$(echo "$line" | cut -d: -f3-)

  UNCOVERED=$(awk -v file="$FILE" -v line="$LINE_NUM" '
    BEGIN { found=0 }
    $0 ~ "SF:"file { found=1; next }
    found && $0 ~ "^DA:"line"," {
      split($0,a,",")
      if (a[2] == 0) print file ":" line ": not covered"
      exit
    }
    $0 ~ /^end_of_record/ { found=0 }
  ' $COVERAGE_FILE)

  if [ -n "$UNCOVERED" ]; then
    echo "❌ Línea sin cobertura: $UNCOVERED  --> Código: $CONTENT"
  fi
done < .changed_lines.tmp

rm -f .changed_lines.tmp
