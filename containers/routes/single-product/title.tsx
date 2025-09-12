interface ITitleProps {
  fa: string;
  en: string;
}

export function Title(props: ITitleProps) {
  return (
    <section className="my-4 flex flex-col gap-1">
      <h1 className="line-clamp-2 text-lg font-bold text-gray-600 lg:line-clamp-1">
        {props.fa}
      </h1>
      <h2 className="line-clamp-1 text-sm font-medium text-gray-400">
        {props.en}
      </h2>
    </section>
  );
}
