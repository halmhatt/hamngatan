export PATH := node_modules/.bin:$(PATH)

SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)

lib: $(LIB)

lib/%.js: src/%.js
	mkdir -p $(@D)
	6to5 $< -o $@