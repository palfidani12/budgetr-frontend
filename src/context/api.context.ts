import { createContext } from 'react';
import type { ApiClient } from '../api/api';

export const ApiContext = createContext<ApiClient>(null as unknown as ApiClient);
