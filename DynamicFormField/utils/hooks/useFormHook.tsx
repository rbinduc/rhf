import {useForm, FieldValues, UseFormProps, UseFormReturn} from 'react-hook-form';

function useFormHook<TFieldValues extends FieldValues = FieldValues, TContext extends object = object>(
  props?: UseFormProps<TFieldValues, TContext>,
  commonValidation?: boolean
): {methods: UseFormReturn<TFieldValues>} {
  const methods = useForm({
    mode: commonValidation ? 'onSubmit' : 'onChange',
    reValidateMode: 'onChange',
    ...props,
  });
  return {methods};
}

export default useFormHook;
