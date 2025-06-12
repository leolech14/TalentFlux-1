const registry = new Set<string>();

export function registerSingleton(id: string) {
  if (registry.has(id)) {
    console.warn(`🚨 Duplicate singleton mounted: ${id}`);
    if (import.meta.env.DEV) {
      throw new Error(`Duplicate singleton: ${id}. Only one instance allowed per page.`);
    }
  } else {
    registry.add(id);
  }
}

export function unregisterSingleton(id: string) {
  registry.delete(id);
}

export function clearRegistry() {
  registry.clear();
}

export function getSingletonCount(id: string): number {
  return registry.has(id) ? 1 : 0;
}

export function getAllRegisteredSingletons(): string[] {
  return Array.from(registry);
}