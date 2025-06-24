#!/bin/bash

# CONFIGURA aquí tu rama base (puede ser origin/main o develop)
BASE_BRANCH=origin/main

# Ejecutar tests con cobertura
echo "🧪 Ejecutando tests con cobertura..."
ng test --code-coverage --watch=false > /dev/null

# Comprobar si coverage existe
COVERAGE_FILE="coverage/angular-testing-shit-project/lcov.info"
if [ ! -f "$COVERAGE_FILE" ]; then
  echo "❌ No se encontró el archivo de cobertura: $COVERAGE_FILE"
  exit 1
fi

# Obtener líneas nuevas (añadidas) en los archivos
echo "🔍 Analizando cambios respecto a $BASE_BRANCH..."
git diff $BASE_BRANCH --unified=0 | grep '^+[^+]' | sed 's/^+//' > .changed_lines.tmp

echo "📊 Comprobando líneas no cubiertas:"
echo "----------------------------------"

# Procesar cada línea añadida
while IFS= read -r line; do
  # Extraer archivo y número de línea
  FILE_LINE=$(echo "$line" | grep -oE 'src/[^:]+:[0-9]+')
  FILE=$(echo "$FILE_LINE" | cut -d: -f1)
  LINE_NUM=$(echo "$FILE_LINE" | cut -d: -f2)

  if [ -z "$FILE" ] || [ -z "$LINE_NUM" ]; then
    continue
  fi

  # Buscar en lcov si está cubierta
  COVERED=$(awk -v file="$FILE" -v line="$LINE_NUM" '
    BEGIN { found=0 }
    $0 ~ "SF:"file { found=1 }
    found && $0 ~ "^DA:"line"," {
      split($0, a, ",")
      if (a[2] == 0) {
        print file ":" line
      }
      exit
    }' $COVERAGE_FILE)

  if [ -n "$COVERED" ]; then
    echo "❌ $COVERED"
  fi
done < .changed_lines.tmp

rm .changed_lines.tmp
