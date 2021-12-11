const convertCase = (name) => {
  return name.replaceAll(/-(.)/g, (_, p1) => p1.toUpperCase())
}

module.exports = (dts, { classes }) => {
  return `
declare let classes: {
  'isActive': string;
${Object.keys(classes).map((className) => `  '${convertCase(className)}': string;`).join('\n')}
};
export = classes;

export let isActive: string;
${Object.keys(classes).map((className) => `export let ${convertCase(className)}: string;`).join('\n')}
`
}
