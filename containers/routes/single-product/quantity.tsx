interface IQuantityProps {
  quantity: number;
}

export function Quantity(props: IQuantityProps) {
  return (
    <section className="mb-4 flex justify-between rounded-lg bg-gray p-3 text-smp font-bold text-gray-500">
      <p>موجودی :</p>
      <p>{props.quantity} در انبار</p>
    </section>
  );
}
