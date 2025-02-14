import { LatestBlogPostEntityFragment } from '@backend/graphql'
import BlogPostCard from '@components/molecules/presentation/BlogPostCard'
import BlogPostHorizontalCard from '@components/molecules/presentation/BlogPostHorizontalCard'
import BlogPostImageCard from '@components/molecules/presentation/BlogPostImageCard'
import ResponsiveCarousel from '@components/organisms/Carousel/ResponsiveCarousel'
import { getCategoryColorLocalStyle } from '@utils/colors'
import { generateImageSizes } from '@utils/generateImageSizes'
import { getNumericLocalDate } from '@utils/local-date'
import { useTranslations } from 'next-intl'
import React from 'react'

export interface FeaturedBlogPostsProps {
  blogPosts: LatestBlogPostEntityFragment[]
}

// Component InbaFeaturedArticles is copied from this component
export const FeaturedBlogPosts = ({ blogPosts }: FeaturedBlogPostsProps) => {
  const t = useTranslations()

  const majorBlog = blogPosts?.[0]

  return (
    <>
      <div className="hidden gap-x-6 py-4 lg:flex">
        <div className="w-1/2">
          <BlogPostImageCard
            variant="shadow"
            title={majorBlog.attributes?.title ?? ''}
            linkHref={`/blog/${majorBlog.attributes?.slug}`}
            imgSrc={majorBlog.attributes?.coverImage?.data?.attributes?.url}
            tag={majorBlog.attributes?.tag?.data?.attributes?.title ?? undefined}
            date={getNumericLocalDate(
              majorBlog.attributes?.date_added ?? majorBlog.attributes?.publishedAt,
            )}
            style={getCategoryColorLocalStyle({
              color:
                majorBlog.attributes?.tag?.data?.attributes?.pageCategory?.data?.attributes?.color,
            })}
            imgSizes={generateImageSizes({ default: '50vw' })}
          />
        </div>
        <div className="flex w-1/2 flex-col gap-y-6">
          {blogPosts?.slice(1, 3).map((blogPost, index) => {
            if (!blogPost.attributes) return null

            const { title, slug, coverImage, tag, date_added, publishedAt } = blogPost.attributes
            const tagTitle = tag?.data?.attributes?.title
            const tagColor = tag?.data?.attributes?.pageCategory?.data?.attributes?.color

            return (
              <BlogPostHorizontalCard
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                variant="shadow"
                title={title ?? ''}
                linkHref={`/blog/${slug}`}
                imgSrc={coverImage?.data?.attributes?.url}
                imgSizes={generateImageSizes({ default: '25vw' })}
                tag={tagTitle ?? undefined}
                date={getNumericLocalDate(date_added ?? publishedAt)}
                style={getCategoryColorLocalStyle({ color: tagColor })}
              />
            )
          })}
        </div>
      </div>

      <ResponsiveCarousel
        className="lg:hidden"
        items={blogPosts.map((blogPost) => {
          const { title, slug, coverImage, date_added, publishedAt, tag } =
            blogPost.attributes ?? {}
          const tagColor = tag?.data?.attributes?.pageCategory?.data?.attributes?.color
          const tagTitle = tag?.data?.attributes?.title

          return (
            <BlogPostCard
              style={getCategoryColorLocalStyle({ color: tagColor })}
              variant="shadow"
              date={getNumericLocalDate(date_added ?? publishedAt)}
              tag={tagTitle ?? undefined}
              title={title ?? ''}
              linkProps={{ children: t('readMore'), href: `/blog/${slug}` }}
              imgSrc={coverImage?.data?.attributes?.url}
              imgSizes={generateImageSizes({ default: '100vw', lg: '33vw' })}
            />
          )
        })}
      />
    </>
  )
}
