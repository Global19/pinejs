#!/bin/bash
java -jar js.jar -O 9 compile.js ../../ometa-js/bs-js-compiler.txt ../../ometa-js/bs-ometa-compiler.txt ../../ometa-js/bs-ometa-js-compiler.txt ../../ometa-js/bs-ometa-optimizer.txt ../../ometa-js/bs-project-list-parser.txt
read -p "press any key"
