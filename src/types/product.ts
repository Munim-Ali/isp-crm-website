import type { IconName } from "@/components/ui/icon";

export interface ProductPreview {
  id: string;
  label: string;
  icon: IconName;
  image: string;
  eyebrow: string;
  description: string;
}
