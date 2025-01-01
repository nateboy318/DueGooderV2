import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'

const compile = async (source: string) => {
  const mdxSource = await compileMDX({source, options: { parseFrontmatter: true, mdxOptions: {
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
      remarkPlugins: [remarkGfm],
      format: "mdx"
    }
   }})
  return {
    data: mdxSource.frontmatter,
    mdx: mdxSource.content
  }
}

export default compile