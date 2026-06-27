'use client';

import { useSizePicker } from '@/lib/sizePickerUI';
import SizePickerModal from './SizePickerModal';

export default function SizePickerContainer() {
  const product = useSizePicker((s) => s.product);
  const close = useSizePicker((s) => s.close);

  if (!product) return null;
  return <SizePickerModal product={product} onClose={close} />;
}
