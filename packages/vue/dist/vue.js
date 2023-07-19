var Vue = (function (exports) {
    'use strict';

    /**
     * 收集依赖
     * @param target
     * @param key
     */
    function effect(fn) {
        var _effect = new ReactiveEffect(fn);
        _effect.run();
    }
    var ReactiveEffect = /** @class */ (function () {
        function ReactiveEffect(fn) {
            this.fn = fn;
        }
        ReactiveEffect.prototype.run = function () {
            this.fn();
        };
        return ReactiveEffect;
    }());
    /**
     * 触发依赖
     * @param target
     * @param value
     */
    function trigger(target, value) {
        console.log('trigger触发依赖');
    }

    var get = createGetter();
    var set = createSetter();
    function createGetter() {
        return function get(target, key, receiver) {
            // 利用 Reflect 得到返回值
            var res = Reflect.get(target, key, receiver);
            return res;
        };
    }
    function createSetter() {
        return function set(target, key, value, receiver) {
            // 利用 Reflect.set 设置新值
            var result = Reflect.set(target, key, value, receiver);
            // 触发依赖
            trigger();
            return result;
        };
    }
    var mutableHandlers = {
        get: get,
        set: set
    };

    var reactiveMap = new WeakMap();
    function reactive(target) {
        return createReactiveObject(target, mutableHandlers, reactiveMap);
    }
    function createReactiveObject(target, baseHandle, proxyMap) {
        // 如果该实例已经被代理，则直接读取即可
        var existingProxy = proxyMap.get(target);
        // 如果该实例已经被代理，则直接返回
        if (existingProxy)
            return existingProxy;
        // 未被代理则生成 proxy 实例
        var proxy = new Proxy(target, baseHandle);
        // 缓存代理对象
        proxyMap.set(target, proxy);
        return proxy;
    }

    exports.effect = effect;
    exports.reactive = reactive;

    return exports;

})({});
//# sourceMappingURL=vue.js.map
