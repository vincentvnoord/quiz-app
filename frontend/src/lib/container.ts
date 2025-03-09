export type DependencyToken = symbol;

interface IDependencyContainer {
    register<T>(type: DependencyToken, instance: T): void;
    get<T>(type: DependencyToken): T;
}

export class DependencyContainer implements IDependencyContainer {
    private dependencies = new Map<DependencyToken, unknown>();

    register<T>(type: DependencyToken, instance: T): void {
        if (!this.dependencies.has(type)) {
            this.dependencies.set(type, instance);
        }
    }

    get<T>(type: DependencyToken): T {
        if (!this.dependencies.has(type)) {
            throw new Error(`Dependency not found: ${type.toString()}`);
        }

        return this.dependencies.get(type) as T;
    }
}