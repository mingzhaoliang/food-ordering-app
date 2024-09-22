export type ActionState<T> = {
  message?: "success" | string | null;
  errors?: Partial<Record<keyof T, any[]>> | null;
  payload?: any | null;
} | null;
