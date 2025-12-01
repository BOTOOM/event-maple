import {Link} from '@/lib/i18n/navigation';
import {useTranslations} from 'next-intl';
import Image from 'next/image';
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function NotFound() {
  const t = useTranslations('Errors.NotFound');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="relative w-64 h-64 mx-auto mb-8">
             <Image
              src="/404.svg"
              alt="404 Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          <div>
            <h1 className="text-6xl font-bold text-gray-900 mb-2">{t('title')}</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('subtitle')}</h2>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed">
              {t('description')}
            </p>
          </div>

          <div>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
            >
              {t('button')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
