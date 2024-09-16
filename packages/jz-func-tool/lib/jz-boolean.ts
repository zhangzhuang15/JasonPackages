import { JZOption, None } from "./jz-option";


export class JZBoolean<T>{
    private constructor(
        private value: T,
        private state: boolean
    ) {}

    deref() {
        return this.state;
    }

    take() {
        return this.value;
    }

    /**
     * 
     * @param effect 
     * @returns 
     */
    andThen<M>(effect: (val: T) => [M, boolean]): JZBoolean<M> | JZBoolean<T> {
        if (this.state) {
            const [result, newState] = effect(this.value);
            return JZBoolean.of(result, newState);
        }

        return this;
    }

    /**
     * 
     * @param effect 
     * @returns 
     */
    orThen<M>(effect: (val: T) => [M, boolean]): JZBoolean<M> | JZBoolean<T> {
        if (!this.state) {
            const [result, newState] = effect(this.value);
            return JZBoolean.of(result, newState);
        }

        return this;
    }


    static of(val: boolean): JZBoolean<None>;
    static of<M>(val: M, state: boolean): JZBoolean<M>;
    static of<M>(
        val: boolean | M,
        state?: boolean
    ) {
        if (typeof val === "boolean" && state === undefined) {
            return new JZBoolean(JZOption.of(null), val);
        }

        if (typeof val === "boolean" && state !== undefined) {
            return new JZBoolean(
                JZBoolean.of(val),
                state
            );
        }

        if (typeof val !== "boolean" && state === undefined) {
            throw Error("state is required");
        }

        return new JZBoolean(val, state!);
    }
}