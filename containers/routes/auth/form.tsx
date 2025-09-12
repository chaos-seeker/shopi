'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowRight } from 'react-icons/fa6';
import OtpInput from 'react18-input-otp';
import { z } from 'zod';
import { useApiCall } from '@/hooks/api-call';
import { cn } from '@/utils/cn';
import { $ } from '@/utils/element-selector';

export function Form() {
  const searchParams = useSearchParams();
  const queryForm = searchParams.get('form') || 'login';
  const [activedForm, setActivedForm] = useState(queryForm);
  useEffect(() => {
    setActivedForm(queryForm);
  }, [queryForm]);

  return activedForm === 'login' ? <FormLogin /> : <FormVerification />;
}

const FormLogin = () => {
  const searchParams = useSearchParams();
  const queryPhoneNumber = searchParams.get('phoneNumber');
  const [, isLoadingSubmitBtn] = useApiCall();
  const [, setNuqsStateForm] = useQueryState('form');
  const [, setNuqsStatePhoneNumber] = useQueryState('phone-number');
  const formSchema = z.object({
    phoneNumber: z.string().regex(new RegExp(/^0\d{10}$/), {
      message: 'شماره موبایل وارد شده معتبر نیست!',
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: queryPhoneNumber || '',
    },
  });
  const handleSubmitForm = async () => {
    setNuqsStatePhoneNumber(form.getValues('phoneNumber'));
    setNuqsStateForm('verification');
  };

  useEffect(() => {
    $('#feild-phone-number')?.focus();
  }, []);

  return (
    <section className="flex w-[300px] flex-col gap-5 rounded-xl border bg-white p-4 sm:w-[350px]">
      {/* head */}
      <div className="flex items-center justify-between">
        <p className="font-bold text-gray-500">ورود / ثبت نام</p>
        <Image
          src="/images/routes/auth/logo.svg"
          alt="ورود"
          width={25}
          height={25}
        />
      </div>
      {/* body */}
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="flex flex-col gap-2"
      >
        {/* fields */}
        <div className="flex flex-col gap-2.5">
          {/* phone number */}
          <div className="flex flex-col gap-2">
            <input
              id="feild-phone-number"
              type="number"
              spellCheck={false}
              className={cn(
                'w-full truncate font-medium rounded-md border p-2.5 border-gray-200 text-slate-500 bg-white text-smp placeholder:text-sm focus:border-purple transition-colors',
                {
                  'border-red-500': form.formState.errors.phoneNumber,
                },
              )}
              placeholder="شماره موبایل خود را وارد کنید ..."
              {...form.register('phoneNumber')}
            />
            <p className="text-sm text-red-500">
              {form.formState.errors.phoneNumber?.message}
            </p>
          </div>
        </div>
        {/* submit */}
        <button
          disabled={isLoadingSubmitBtn}
          className="mt-1 h-12 w-full justify-center rounded-lg bg-red font-medium text-white disabled:opacity-50"
        >
          ورود
        </button>
      </form>
    </section>
  );
};

const FormVerification = () => {
  // callApiSubmitBtn
  const [, setNuqsForm] = useQueryState('form');
  const [, isLoadingSubmitBtn] = useApiCall();
  const formSchema = z.object({
    // length 4
    otpCode: z.string().regex(new RegExp(/^\d{4}$/), {
      message: 'کد وارد شده معتبر نیست!',
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otpCode: '',
    },
  });
  const handleSubmitForm = async () => {
    // ...
  };
  const handleBackBtn = () => {
    setNuqsForm('login');
  };

  return (
    <section className="flex w-[300px] flex-col gap-5 rounded-xl border bg-white p-4 sm:w-[350px]">
      {/* head */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackBtn}
            className="w-fit rounded-md border p-2"
          >
            <FaArrowRight className="fill-red" />
          </button>
          <p className="font-bold text-gray-500">کد تایید را وارد کنید</p>
        </div>
        <Image
          src="/images/routes/auth/logo.svg"
          alt="ورود"
          width={25}
          height={25}
        />
      </div>
      {/* body */}
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="flex flex-col gap-2"
      >
        {/* fields */}
        <div className="flex flex-col gap-2.5">
          {/* otp code */}
          <div className="flex flex-col gap-2">
            <div dir="ltr">
              <OtpInput
                shouldAutoFocus
                value={form.watch('otpCode')}
                onChange={(value: any) => {
                  form.setValue('otpCode', value);
                  if (form.watch('otpCode').length === 4) {
                    form.trigger('otpCode');
                  }
                }}
                containerStyle="flex gap-3"
                inputStyle="!w-full !h-full rounded-lg"
                className={cn(
                  'rounded-lg font-medium border-gray-200 border h-14 !w-full',
                  {
                    'border-red-500': form.formState.errors.otpCode,
                  },
                )}
                numInputs={4}
                isInputNum
                separator={<span />}
              />
            </div>
            <p className="text-sm text-red-500">
              {form.formState.errors.otpCode?.message}
            </p>
          </div>
        </div>
        {/* submit */}
        <button
          disabled={isLoadingSubmitBtn}
          className="mt-1 h-12 w-full justify-center rounded-lg bg-red font-medium text-white disabled:opacity-50"
        >
          ورود
        </button>
      </form>
    </section>
  );
};
