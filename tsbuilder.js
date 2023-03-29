/**
 * Typescript Builder
 *
 * Modifies auto-generated `.d.ts` files produced by the Typescript compiler.
 */

const path = require('path')
const fs = require('fs')

console.log('Modifying auto-generated `.d.ts` files:')

// Build a path to the directory that the Typescript compiler outputs `.d.ts` files
// This is specified in the `outDir` property of the tsconfig.json file
// Note: Use a regex because tsconfig.json contains comments (so it's not real JSON)
const buffer = fs.readFileSync(path.join(__dirname) + '/tsconfig.json')
const match = buffer.toString().match(/"outDir": "(.*?)"/)
const tsPath = path.join(__dirname, match[1])

// Iterate over all files in the build directory
fs.readdir(tsPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err)
  }
  files.forEach((fileName) => {
    // Read each file into an array
    const buffer = fs.readFileSync(tsPath + '/' + fileName)
    const str = buffer.toString()
    // Modify all classes that extend the Service class
    if (str.indexOf(' extends Service') > 0) { // && fileName.indexOf('DigitalAssets.d.ts') > -1) {
      fs.writeFileSync(tsPath + '/' + fileName, buildServiceClass(fileName, str))
      console.log('- ' + fileName + ' modified')
      // console.log(
      //   buildServiceClass(fileName, str)
      // )
    }
  })
})
// Done

/**
 * Makes revised content for `.d.ts` files that provide Typescript
 * declarations for classes that extend the Service class.
 *
 * @param {String} fileName   Name of file
 * @param {String} str        File contents as string
 * @return {String}
 */
function buildServiceClass (fileName, str) {
  const namespace = fileName.replace('.d.ts', '')
  // Extract type names
  const types = str.split('export type ').slice(1).map((s, i) => {
    return s.substring(0, s.indexOf(' '))
  })

  /**
   * Scan through each line in the file and:
   * - Add 'export namespace <namespace> {}' block and indentation around
   *   all type declarations.
   * - Extract the lines that represent the class definition within the file
   */
  const lines = str.split('\n')
  const typeDefLines = []
  const classDefLines = []
  let indent = ''
  let isClassDefLine = true
  for (let i = 0; i < lines.length; i++) {
    // Look for the first "export type " statement.
    // This marks the start of type declarations that need to be encapsulated in a namespace.
    if (indent === '' && lines[i].indexOf('export type ') === 0) {
      // Add an opening namespace delimiter
      typeDefLines.push('export namespace ' + namespace + ' {')
      indent = '    '
      isClassDefLine = false
    }
    // Look for the "import Service from ".
    // This marks the end of type declarations that need to be encapsulated in a namespace
    if (lines[i].indexOf('import Service from ') === 0) {
      // Add a closing namespace delimiter
      typeDefLines.push('}')
      indent = ''
    }
    if (isClassDefLine) {
      classDefLines.push(lines[i])
    } else {
      typeDefLines.push(indent + lines[i])
    }
  }

  /**
   * Update the class definition section so that all references to type declarations
   * are now prefixed with the namespace name.
   *
   * This requires finding methods that use type declarations as arguments and/or
   * return values wrapped in a Promise (return values are always Promises).
   *
   * eg.
   *
   *    export default class UserService extends Service {
   *        createUser({ userId, enabled }: UserParams): Promise<User>;
   *        getUsers({ userStatus }?: {
   *            userStatus?: UserStatus;
   *        }): Promise<UserList>;
   *    }
   *
   * If this files type declarations are now in the "Profile" namespace the contents will
   *
   *    export default class ProfileService extends Service {
   *        createUser({ userId, enabled }: Profile.UserParams): Promise<Profile.User>;
   *        getUsers({ userStatus }?: {
   *            userStatus?: Profile.UserStatus;
   *        }): Promise<Profile.UserList>;
   *    }
   */
  let classDefStr = classDefLines.join('\n')
  types.forEach((type) => {
    classDefStr = classDefStr.replace(new RegExp('\\: ' + type + ';', 'g'), ': ' + namespace + '.' + type + ';')
    classDefStr = classDefStr.replace(new RegExp('\\: ' + type + '\\)', 'g'), ': ' + namespace + '.' + type + ')')
    classDefStr = classDefStr.replace(new RegExp('Promise\\<' + type + '\\>', 'g'), 'Promise<' + namespace + '.' + type + '>')
  })

  /**
   * Update the type definition section so that any references to imported types
   * include the namespace in the import statement.
   * eg.
   *
   *  hostAppOs?: import("./Notifications").OsName;
   *
   * Update to:
   *
   *  hostAppOs?: import("./Notifications").Notifications.OsName;
   */
  let typeDefStr = typeDefLines.join('\n')
  const re = /import\("\.\/(.*?)"\)\.(.*?);/g
  const matches = [...typeDefStr.matchAll(re)]
  matches.forEach((match) => {
    const replacement = match[0].replace('.' + match[2], '.' + match[1] + '.' + match[2])
    typeDefStr = typeDefStr.replace(match[0], replacement)
  })

  return classDefStr + '\n' + typeDefStr
}
