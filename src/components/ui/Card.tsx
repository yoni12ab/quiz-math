// src/components/ui/Card.tsx
import React from 'react';
import { Box, Heading, BoxProps } from '@chakra-ui/react';

export const Card: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      p={4}
      shadow="sm"
      {...props}
    >
      {children}
    </Box>
  );
};

export const CardHeader: any = ({ children }: any) => (
  <Box mb={4}>{children}</Box>
);

export const CardTitle: any = ({ children }: any): any => (
  <Heading size="md">{children}</Heading>
);

export const CardContent: any = ({ children }: any): any => (
  <Box>{children}</Box>
);
