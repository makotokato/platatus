import path from 'path';
import glob from 'glob';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
const markdown = new MarkdownIt();

export default class FixtureParser {
  constructor(root) {
    this.root = path.normalize(root);
  }

  read() {
    this.results = new Map(
      glob.sync(path.join(this.root, '*.md'))
        .map(this.readFile, this)
        .map((entry) => [entry.slug, entry])
    );
    return Promise.resolve(this.results);
  }

  readFile(src) {
    const meta = matter.read(src);
    const summary = markdown.renderInline(meta.content);
    const slug = path.basename(src, '.md');
    const file = path.relative(this.root, src);
    return Object.assign({
      summary,
      slug,
      file,
    }, meta.data);
  }
}