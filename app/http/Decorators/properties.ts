export function Init(value?: any) {
    return function (target: any, propertyName: string) {

        const propertyType = Reflect.getMetadata('design:type', target, propertyName);
        Object.defineProperty(target, propertyName, {
            value: value,
            writable: true,
            configurable: true,
            enumerable: true,
        });

        Reflect.defineMetadata('propertyType', propertyType, target, propertyName);
    }
}