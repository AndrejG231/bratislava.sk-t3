// @ts-strict-ignore
import { ArrowRightIcon } from '@assets/images'
import { useUIContext } from '@bratislava/common-frontend-ui-context'
import { LatestBlogPostEntityFragment, NewsCardBlogFragment } from '@bratislava/strapi-sdk-homepage'
import { Iframe } from '@bratislava/ui-bratislava'
import Button from '@components/forms/simple-components/Button'
import BlogPostCard from '@components/molecules/presentation/BlogPostCard'
import Carousel from '@components/organisms/Carousel/Carousel'
import { LocalDate, Month, Period } from '@js-joda/core'
import { getCategoryColorLocalStyle } from '@utils/colors'
import { generateImageSizes } from '@utils/generateImageSizes'
import { getNumericLocalDate } from '@utils/local-date'
import { ParsedOfficialBoardDocument } from 'backend/services/ginis'
import cx from 'classnames'
import { useLocale, useTranslations } from 'next-intl'

import React from 'react'
import useSWR from 'swr'

import { DocumentCard } from '../../DocumentCard/DocumentCard'
import { HorizontalScrollWrapper } from '../../HorizontalScrollWrapper/HorizontalScrollWrapper'
import { NewsCard, NewsCardProps } from '../../NewsCard/NewsCard'
import { TabBarTab } from '../../TabBarTab/TabBarTab'
import { Tag } from '../../Tag/Tag'

const imageSizes = generateImageSizes({ lg: '33vw', default: '50vw' })

export type TPostsTab = { category?: string; newsCards?: NewsCardProps[] }

export interface PostsProps {
  className?: string
  posts: TPostsTab[] | undefined
  // latestPost?: BlogPost[]
  latestPost: LatestBlogPostEntityFragment[] | null
  leftHighLight: NewsCardBlogFragment | null | undefined
  rightHighLight: NewsCardBlogFragment | null | undefined
  readMoreText?: string
  readMoreNewsText?: string
  rozkoPosts: LatestBlogPostEntityFragment[] | null
}

export const Posts = ({
  className,
  posts = [],
  leftHighLight,
  rightHighLight,
  readMoreText,
  readMoreNewsText,
  latestPost,
  rozkoPosts,
}: PostsProps) => {
  const locale = useLocale()

  const [activeTab, setActiveTab] = React.useState(0)
  // TODO refactor this
  const [activePosts] = React.useState(posts[activeTab])
  const [activeNewsCards] = React.useState<NewsCardProps[]>(activePosts?.newsCards ?? [])

  // TODO handle loading and errors
  const { data: officialBoardData } = useSWR<ParsedOfficialBoardDocument[]>(
    '/api/ginis/newest',
    () => fetch('/api/ginis/newest').then((res) => res.json()),
  )
  const documents = officialBoardData || []

  const { Link: UILink } = useUIContext()

  const t = useTranslations()

  const now = LocalDate.now()
  const deadline = LocalDate.of(2024, Month.MARCH, 14)
  const isAfterDeadline = Period.between(now, deadline).isNegative()

  const roadClosuresAddress = 'doprava-a-mapy/sprava-a-udrzba-komunikacii/rozkopavky-a-uzavery'
  const roadClosuresAddressNew = 'doprava-a-mapy/sprava-a-udrzba-komunikacii'

  return (
    <div className={cx(className)}>
      <HorizontalScrollWrapper className="-mx-8 justify-start space-x-4 px-8 lg:justify-center">
        <div className="flex space-x-8 lg:space-x-32">
          {posts.map((post, index) => (
            <TabBarTab
              key={index}
              tab={{ key: index.toString(), title: post.category ?? '' }}
              onClick={() => {
                setActiveTab(index)
              }}
              isActive={activeTab === index}
            />
          ))}
        </div>
      </HorizontalScrollWrapper>

      {activeTab === 0 && (
        <>
          {/* TODO carousel and new BlogPostCard is used only on mobile */}
          <Carousel
            className="-mx-8 lg:hidden"
            itemClassName="w-[calc(100%-1rem)] md:w-[calc(50%-1rem)] py-8"
            listClassName="px-8"
            visibleCount={1}
            hideControls
            items={[leftHighLight, rightHighLight].map((post, i) => {
              const { title, slug, coverImage, date_added, publishedAt, tag } =
                post.data.attributes ?? {}
              return {
                key: `${i}`,
                element: (
                  <BlogPostCard
                    style={getCategoryColorLocalStyle({
                      color: tag.data.attributes.pageCategory.data.attributes.color,
                    })}
                    variant="shadow"
                    date={getNumericLocalDate(date_added ?? publishedAt)}
                    tag={tag.data.attributes.title}
                    title={title}
                    linkProps={{ children: readMoreText, href: `/blog/${slug}` }}
                    imgSrc={coverImage?.data.attributes.url}
                    imgSizes={imageSizes}
                  />
                ),
              }
            })}
          />
          <div className="mt-8 hidden lg:mt-14 lg:block">
            <HorizontalScrollWrapper className="-mx-8 space-x-4 px-8 pb-8 lg:pb-0">
              <div className="flex grid-cols-3 gap-x-5 lg:grid lg:gap-x-8">
                {leftHighLight && (
                  <NewsCard
                    {...leftHighLight?.data?.attributes}
                    readMoreText={readMoreText}
                    coverImageSizes={imageSizes}
                  />
                )}
                {rightHighLight && (
                  <NewsCard
                    {...rightHighLight?.data?.attributes}
                    readMoreText={readMoreText}
                    coverImageSizes={imageSizes}
                  />
                )}

                {latestPost?.length > 0 && (
                  <div className="hidden lg:block">
                    {latestPost.map((newsCard, i) => {
                      const card = newsCard.attributes
                      const tag = card.tag.data?.attributes
                      const colorStyle = getCategoryColorLocalStyle({
                        color: card.tag?.data?.attributes?.pageCategory?.data?.attributes?.color,
                      })

                      return (
                        <div key={i} className="relative" style={colorStyle}>
                          {tag && (
                            <div className="mb-5">
                              <Tag title={tag?.title} />
                            </div>
                          )}
                          <UILink href={`/blog/${card.slug}`}>
                            <div className="mb-8 font-semibold text-font underline after:absolute after:inset-0 hover:text-category-600">
                              {card.title}
                            </div>
                          </UILink>
                        </div>
                      )
                    })}
                  </div>
                )}
                <div className="col-span-3 mt-14 hidden justify-center lg:flex">
                  {latestPost?.length > 0 && (
                    <Button
                      href={t('allNewsLink')}
                      variant="category-outline"
                      endIcon={<ArrowRightIcon />}
                    >
                      {readMoreNewsText}
                    </Button>
                  )}
                </div>
              </div>
            </HorizontalScrollWrapper>
            <div className="flex justify-center lg:hidden">
              <Button
                href={t('allNewsLink')}
                variant="category-outline"
                endIcon={<ArrowRightIcon />}
              >
                {t('allNews')}
              </Button>
            </div>
          </div>
        </>
      )}
      {activeTab === 1 && (
        <div className="mt-14 flex flex-col gap-y-10">
          <div className="flex flex-col items-center gap-y-5">
            {documents.map((document, index) => (
              <DocumentCard
                key={index}
                {...document}
                className="min-w-full max-w-4xl"
                viewButtonText={t('files')}
                downloadButtonText="TODO-fix"
              />
            ))}
          </div>

          <Button
            href="/mesto-bratislava/transparentne-mesto/uradna-tabula"
            variant="category-outline"
            endIcon={<ArrowRightIcon />}
          >
            {t('toOfficialBoard')}
          </Button>
        </div>
      )}
      {activeTab === 2 && (
        <div className="mt-8 block lg:mt-14">
          {/* TODO erase unused code after 14.3.2023 and let only iframe part */}
          {isAfterDeadline ? (
            <>
              <div className="pb-8">
                <Iframe
                  url={`https://cdn-api.bratislava.sk/static-pages/closures-and-restrictions-map/index.html?lang=${locale}`}
                  iframeWidth="container"
                  iframeHeight="620"
                  fullHeight={false}
                  allowFullscreen={false}
                />
              </div>
              <div className="flex justify-center">
                <Button
                  href={roadClosuresAddressNew}
                  variant="category-outline"
                  endIcon={<ArrowRightIcon />}
                >
                  {t('moreInfo')}
                </Button>
              </div>
            </>
          ) : (
            <>
              <HorizontalScrollWrapper className="-mx-8 space-x-4 px-8 pb-8 lg:pb-0">
                <div className="flex grid-cols-3 gap-x-5 lg:grid lg:gap-x-8">
                  {rozkoPosts?.[0] && (
                    <NewsCard
                      {...rozkoPosts?.[0].attributes}
                      readMoreText={readMoreText}
                      coverImageSizes={imageSizes}
                    />
                  )}
                  {rozkoPosts?.[1] && (
                    <NewsCard
                      {...rozkoPosts?.[1].attributes}
                      readMoreText={readMoreText}
                      coverImageSizes={imageSizes}
                    />
                  )}

                  {rozkoPosts?.length > 2 && (
                    <div className="hidden lg:block">
                      {rozkoPosts.slice(2, 7).map((newsCard, i) => {
                        const card = newsCard.attributes
                        const tag = card.tag.data?.attributes
                        const colorStyle = getCategoryColorLocalStyle({
                          color: card.tag?.data?.attributes?.pageCategory?.data?.attributes?.color,
                        })

                        return (
                          <div key={i} className="relative" style={colorStyle}>
                            {card.tag && (
                              <div className="mb-5">
                                <Tag title={tag?.title} />
                              </div>
                            )}
                            <UILink href={`/blog/${card.slug}`}>
                              <div className="mb-8 font-semibold text-font underline after:absolute after:inset-0 hover:text-category-600">
                                {card.title}
                              </div>
                            </UILink>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <div className="col-span-3 mt-14 hidden justify-center lg:flex">
                    {rozkoPosts?.length > 0 && (
                      <Button
                        href={roadClosuresAddress}
                        variant="category-outline"
                        endIcon={<ArrowRightIcon />}
                      >
                        {readMoreNewsText}
                      </Button>
                    )}
                  </div>
                </div>
              </HorizontalScrollWrapper>
              <div className="flex justify-center lg:hidden">
                <Button
                  href={roadClosuresAddress}
                  variant="category-outline"
                  endIcon={<ArrowRightIcon />}
                >
                  {t('allNews')}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      {activeTab > 2 && (
        <div className="text-h4 mt-14 items-end px-8 text-center">
          {t('allInformationOnSite')}{' '}
          <UILink
            className="underline hover:text-gray-600"
            href="https://zverejnovanie.bratislava.sk"
          >
            <div className="lg:hidden">
              <br />
            </div>
            <b>zverejnovanie.bratislava.sk</b>
          </UILink>
        </div>
      )}

      {/* Mobile */}
      <div className="mt-9 hidden">
        <HorizontalScrollWrapper className="-mx-8 space-x-4 px-8 pb-12">
          {activeNewsCards.map((newsItem, index) => (
            <NewsCard
              key={index}
              readMoreText={readMoreText}
              className="w-11/12 shrink-0"
              {...newsItem}
            />
          ))}
        </HorizontalScrollWrapper>
        <div className="flex justify-center">
          <Button href={t('allNewsLink')} variant="category-outline" endIcon={<ArrowRightIcon />}>
            {t('allNews')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Posts
