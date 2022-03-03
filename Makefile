.PHONY: build
build: node_modules
	@npm run build

node_modules:
	@npm install

.PHONY: run
run: node_modules
	@npm run dev
