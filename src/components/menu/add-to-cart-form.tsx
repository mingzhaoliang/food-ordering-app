"use client";

import { addCartItemAction } from "@/actions/orderFlow/cart.action";
import { useCart } from "@/lib/store/context/cart.context";
import { priceFormatter } from "@/lib/utils/formatter";
import { cartItemSchema, CartItemSchema } from "@/schemas/zod/orderFlow/cart-item.schema";
import { DishDTO } from "@/services/mongoose/store/dish.dal";
import { ActionState } from "@/types/ActionState";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Minus, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import withActionStateReset from "../hoc/withActionStateReset";
import { Button } from "../ui/shadcn/button";
import { Form, FormControl, FormField, FormItem } from "../ui/shadcn/form";
import { Input } from "../ui/shadcn/input";
import { useToast } from "../ui/shadcn/use-toast";

const FormCheckbox = dynamic(() => import("../ui/form/form-checkbox"));
const FormTextarea = dynamic(() => import("../ui/form/form-textarea"));

interface AddToCartFormProps {
  dish: DishDTO;
  onReset: () => void;
}

const AddToCartForm = withActionStateReset(({ dish, onReset }: AddToCartFormProps) => {
  const { addToCartHandler } = useCart();
  const { toast } = useToast();
  const form = useForm<CartItemSchema>({
    resolver: zodResolver(cartItemSchema),
    defaultValues: {
      quantity: 1,
      specialInstructions: "",
      addOns: [],
    },
  });

  const addOns = dish.customisation.addOns.map((addOn) => ({
    label: `${addOn.name} (+${priceFormatter(addOn.price)})`,
    value: addOn.name,
  }));

  const total =
    (dish.price +
      dish.customisation.addOns
        .filter((addOn) => form.watch("addOns").includes(addOn.name))
        .reduce((acc, addOn) => acc + addOn.price, 0)) *
    form.watch("quantity");

  const [actionState, formAction, pending] = useActionState<ActionState<CartItemSchema>, FormData>(
    addCartItemAction.bind(null, dish._id),
    null
  );

  const handleUpdate = (value: number) => {
    form.setValue("quantity", form.getValues("quantity") + value);
  };
  const handleIncrement = handleUpdate.bind(null, 1);
  const handleDecrement = handleUpdate.bind(null, -1);

  const handleSubmit = async (formData: FormData) => {
    formData.set("addOns", JSON.stringify(form.getValues("addOns")));

    formAction(formData);
  };

  useEffect(() => {
    if (!actionState?.message) return;
    if (actionState.message === "success") {
      addToCartHandler();
      form.reset();
      onReset();
    } else {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: actionState.message,
      });
    }
  }, [actionState?.message, addToCartHandler, form, onReset, toast]);

  return (
    <Form {...form}>
      <form action={handleSubmit} className="flex-1 flex flex-col gap-4 sm:overflow-auto">
        {actionState?.errors && (
          <p className="text-sm text-destructive">
            {Object.values(actionState.errors).flatMap((error) => error.map((e) => <span key={e}>{e}</span>))}
          </p>
        )}
        {addOns.length > 0 && (
          <FormCheckbox
            key={"addOns" + form.watch("addOns").join("")}
            id="addOns"
            name="addOns"
            label="Add-ons"
            description="Add extra toppings or sides to your dish"
            items={addOns}
            isVertical
          />
        )}
        {dish.customisation.specialInstructions && (
          <FormTextarea
            id="specialInstructions"
            name="specialInstructions"
            label="Special instructions"
            placeholder="Add special instructions"
            description="Max 200 characters"
            autoFocus={false}
            hideLabel
            className="h-[calc(100%-4rem)] rounded-2xl lg:text-base focus-visible:ring-0 focus-visible:ring-offset-0"
            itemClassName="flex-1"
          />
        )}
        <div className="max-sm:pb-3 sticky bottom-0 bg-stone-50 pt-2 flex justify-between items-center gap-2">
          <p className="body-1 font-medium">{priceFormatter(total)}</p>

          <div className="flex-1 flex justify-end rounded-md overflow-hidden">
            <Button
              disabled={form.watch("quantity") <= 1}
              type="button"
              variant="secondary"
              size="icon"
              className="!w-8 !h-6 rounded-none"
              onClick={handleDecrement}
            >
              <Minus className="size-icon-1" />
            </Button>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      id="quantity"
                      type="number"
                      onChange={(e) => {
                        form.setValue("quantity", +e.target.value);
                      }}
                      min={1}
                      className="w-8 text-center rounded-none !h-6 !p-0 focus-visible:ring-offset-0 focus-visible:ring-0 no-arrows"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="!w-8 !h-6 rounded-none"
              onClick={handleIncrement}
            >
              <Plus className="size-icon-1" />
            </Button>
          </div>

          <Button disabled={pending} type="submit">
            {pending && <Loader2 className="size-icon-1 animate-spin mr-2" />} Add to cart
          </Button>
        </div>
      </form>
    </Form>
  );
});

export default AddToCartForm;
