interface IBoard extends Array<number> {}
interface IPosition extends Array<number> {}

interface IScreen {
    activate(): void;
    deactivate(): void;
}