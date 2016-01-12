# d-ts-gen

Simple d.ts generator for javascript node packages.

## Usage

npm install "library to scan"

node generate.js "library to scan"

## Usage as global

```bash
npm install -g d-ts-gen

npm install "library to scan"

d-ts-gen "%CD%\node_modules\library to scan" > "library to scan.d.ts"
```

Then, edit "library to scan.d.ts" and tunne it.