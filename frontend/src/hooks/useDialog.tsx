import React, { useMemo } from 'react';

type DialogState<TResult = undefined, TArgument = void> = {
  visible: boolean;
  argument: TArgument | undefined;
  resolvers: Array<(arg: TResult) => void>;
};

export function useDialog<TResult = undefined, TArgument = void>() {
  const [state, setState] = React.useState<DialogState<TResult, TArgument>>({
    visible: false,
    argument: undefined,
    resolvers: [],
  });

  const onHide = (result: TResult) => {
    setState({
      visible: false,
      argument: undefined,
      resolvers: [],
    });
    state.resolvers.forEach((resolver) => resolver(result));
  };

  const dialogProps = useMemo(
    () => ({
      visible: state?.visible,
      onHide,
      draggable: false,
      resizable: false,
    }),
    [state],
  );

  const show = (arg: TArgument): Promise<TResult> => {
    return new Promise<TResult>((resolve) => {
      setState({
        visible: true,
        argument: arg,
        resolvers: [...state.resolvers, resolve],
      });
    });
  };

  return {
    dialogProps,
    show,
    onHide,
    argument: state.argument,
  };
}
