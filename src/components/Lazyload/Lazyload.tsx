import React, { Suspense } from 'react';
import Loading from './Loading';

export default function (loader: any) {
    const OtherComponent = React.lazy(loader);
    return function MyComponent(props: any) {
        const duration = props.duration || 0;
        return (
            <Suspense fallback={<Loading duration={ duration } />}>
                <OtherComponent {...props} />
            </Suspense>
        );
    };
}