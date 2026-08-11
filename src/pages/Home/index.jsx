import { useTranslation } from 'react-i18next'
import HeroSection from '../../components/home/HeroSection'
import CategorySection from '../../components/home/CategorySection'
import JoinFamilySection from '../../components/home/JoinFamilySection'
import FeaturedProducts from '../../components/home/FeaturedProducts'
import FlashSale from '../../components/home/FlashSale'
import BrandsSection from '../../components/home/BrandsSection'
import Newsletter from '../../components/home/Newsletter'
import InstagramGallery from '../../components/home/InstagramGallery'

const Home = () => {
  const { t } = useTranslation()

  return (
    <>
      <HeroSection />
      <CategorySection />
      <JoinFamilySection />
      <FeaturedProducts
        title={t('home.featured.title')}
        subtitle={t('home.featured.subtitle')}
        limit={8}
      />
      <BrandsSection />
      <Newsletter />
      <InstagramGallery />
    </>
  )
}

export default Home
