import { Heading } from '@chakra-ui/react';
import React from 'react';

import { useTranslation } from 'react-i18next';

type NotFoundProps = {};

const NotFound = (props: NotFoundProps) => {
    const { t } = useTranslation();

    return <Heading textAlign='center'>{t('errors.error_404')}</Heading>;
    
    // return <div>{t('errors.error_404')}</div>;
    // return <div>404 Not found</div>;
};

export default NotFound;
