import { ViewportAnimation } from '@/components/viewport-animation';
import { Form } from '@/containers/routes/auth/form';
import { ArrowUp } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="relative flex h-screen items-center justify-center pb-6 pt-20">
      <BackToTop />
      <ViewportAnimation>
        <Form />
      </ViewportAnimation>
    </div>
  );
}

const BackToTop = () => {
  return (
    <Link href="/" className="absolute top-20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <ArrowUp className="stroke-red" size={20} />
        <p className="text-sm font-bold text-red">بازگشت به صفحه اصلی</p>
      </div>
    </Link>
  );
};
