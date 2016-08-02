const generators = require('yeoman-generator');
const yosay = require('yosay');
const path = require('path');
const slug = require('slug');
const camel = require('camelcase');
const normalize = require('normalize-url');
const humanize = require('humanize-url');

module.exports = generators.Base.extend({
  initializing() {
    this.log(yosay('Risen: A generator for the people by the people.'));
  },
  prompting() {
    const done = this.async();
    const prompts = [
      {
        name: 'githubUsername',
        message: 'What is your GitHub user name?',
        store: true,
        validate: ({length = 0}) => length > 0 ? true : 'github needed',
      },
      {
        name: 'moduleKeywords',
        message: 'Keywords?',
        default: 'node'
      },
      {
        name: 'website',
        message: 'What is your website URL?',
        store: true,
        filter: (s) => normalize(s),
        default: (props) => `https://github.com/${props.githubUsername}`,
      },
      {
        name: 'moduleName',
        message: 'What is the module name?',
        filter: (s) => slug(s),
        default: path.basename(process.cwd()).replace(/\s/g, '-'),
      },
      {
        name: 'moduleDesc',
        message: 'What is the module description?',
        default: ({moduleName = ''}) => moduleName,
      },
      {
        type: 'confirm',
        name: 'center',
        message: 'Center title and badges in README?',
        store: true,
        default: false
      }
    ];
    this.prompt(prompts)
      .then((props)  => {
        this.moduleName = props.moduleName;
        this.moduleDesc = props.moduleDesc;
        this.camelModuleName = camel(props.moduleName);
        this.moduleKeywords = props.moduleKeywords.trim().split(',').map((s = '') => s.trim());

        this.githubUsername = props.githubUsername
        this.name = this.user.git.name();
        this.email = this.user.git.email();
        this.website = props.website;
        this.humanizedWebsite = humanize(props.website);

        this.template(props.center ? 'README-2.md' : 'README.md', 'README.md');
        this.template('package.json');
        this.template('LICENSE');
        this.template('CHANGELOG.md');
        this.template('index.js', 'src/index.js');
        this.template('test.js', 'test/index.js');
        this.template('editorconfig', '.editorconfig');
        this.template('gitignore', '.gitignore');
        this.template('eslintrc', '.eslintrc');

        done();
      });
  },
  writing() {
    [
      { name: 'travis', options: { config: { after_script: ['npm run coveralls'] }}},
      { name: 'babel',  options: { 'skip-install': this.options['skip-install'] }},
      { name: 'git-init' },
    ].forEach(({name, options = {}}) => this.composeWith(
      name,
      {options},
      {local: require.resolve(`generator-${name}/generators/app`)}
    ));
  },
  installing() {
});
