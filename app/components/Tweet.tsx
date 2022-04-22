import TweetImage from '~/assets/tweet.jpeg'

export const Tweet = () => {
  return (
    <a href="https://twitter.com/SplatoonJP/status/741088368084144128" target={'_blank'} rel="noreferrer">
      <img height={500} width={500} src={TweetImage} alt="" />
    </a>
  )
}
