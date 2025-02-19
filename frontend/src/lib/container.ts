type Constructor<T> = new (...args: any[]) => T;

export type DependencyToken<T> = symbol;

interface IDependencyContainer {
    register<T>(type: DependencyToken<T>, instance: T): void;
    get<T>(type: DependencyToken<T>): T;
}

export class DependencyContainer implements IDependencyContainer {
    private dependencies = new Map<DependencyToken<any>, any>();

    register<T>(type: DependencyToken<T>, instance: T): void {
        if (!this.dependencies.has(type)) {
            this.dependencies.set(type, instance);
        }
    }

    get<T>(type: DependencyToken<T>): T {
        if (!this.dependencies.has(type)) {
            throw new Error(`Dependency not found: ${type.toString()}`);
        }

        return this.dependencies.get(type);
    }
}