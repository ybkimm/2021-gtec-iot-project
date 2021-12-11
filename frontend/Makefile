FONT_DIR := src/assets/fonts
FONT_OUT := $(addprefix font/webfont,.eot .ttf .woff .woff2 .css .sass)
FONT_DST := $(addprefix ${FONT_DIR}/icons/,${FONT_OUT}) \
			$(addprefix ${FONT_DIR}/passdot/,${FONT_OUT})

DST_DIR := dist
DST_FILES := $(addprefix ${DST_DIR}/,index.css index.d.ts index.js index.mjs fonts)
SRC_DIR := src
SRC_FILES := $(shell find ${SRC_DIR} -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.module.css' \) ! -name '*.stories.tsx')

MKDIRP := mkdir -p
BUILD_FONT := node scripts/build-font.js
ROLLUP := node_modules/.bin/rollup
SIRV := node_modules/.bin/sriv
START_STORYBOOK := node_modules/.bin/start-storybook -p 6006
BUILD_STORYBOOK := node_modules/.bin/build-storybook
TAILWIND := yarn tailwind

# https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.DEFAULT_GOAL := help
.PHONY := help
help: ## Print this message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# Development commands

.PHONY := dev
dev: ## Starts development server
	${ROLLUP} -c -w

.PHONY := serve
serve: ## Serving dist
	${SIRV} dist --no-clear

.PHONY := sb
sb: storybook-start ## Alias for storybook-start

.PHONY := storybook-start
storybook-start: ## Starts the storybook server at port 6006
	${START_STORYBOOK}

.PHONY := storybook-build
storybook-build: ## Builds the storybook
	${BUILD_STORYBOOK}

# Build application

.PHONY := build
build: ${FONT_DST} ## Build dist
	rm -rf ${DST_DIR}
	${ROLLUP} -c
	cp src/index.prod.html ${DST_DIR}/index.html

# Assets

.PHONY := tailwind
tailwind: src/styles/tailwind.scss

src/styles/tailwind.scss: tailwind.config.js
	${TAILWIND} build -o $@

.PHONY := font
font: ${FONT_DST} ## Build font assets

$(addprefix %/,${FONT_OUT}): %/meta/codepoints.json %/meta/font.json %/svg/*.svg
	${MKDIRP} $*/font
	${BUILD_FONT} $*
