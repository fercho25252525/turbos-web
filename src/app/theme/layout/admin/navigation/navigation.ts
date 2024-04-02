export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'gestion-usuario',
    title: 'Gestión Usuario',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'usuario',
        title: 'Usuario',
        type: 'item',
        url: '/user',
        icon: 'feather icon-user'
      }, {
        id: 'cliente',
        title: 'Cliente',
        type: 'item',
        url: '/customer',
        icon: 'feather icon-users'
      }
    ]
  },
  {
    id: 'gestión-inventario',
    title: 'Gestión Inventario',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'proveedores', 
        title: 'Proveedores',
        type: 'item',
        url: '/provider',
        icon: 'feather icon-home'
      },
      {
        id: 'inventario',
        title: 'Inventario',
        type: 'item',
        url: '/inventory',
        icon: 'feather icon-home'
      }      
    ]
  },
  {
    id: 'seguimiento_procesos',
    title: 'Seguimiento Proceso',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'orden-trabajo',
        title: 'Orden De Trabajo',
        type: 'item',
        url: '/work-order',
        icon: 'feather icon-home'
      },
      {
        id: 'estado',
        title: 'Estado Proceso',
        type: 'item',
        url: '/analytics',
        icon: 'feather icon-home'
      }
    ]
  },
  {
    id: 'reporte',
    title: 'Reporte',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'reporte',
        title: 'Reporte',
        type: 'item',
        url: '/analytics',
        icon: 'feather icon-home'
      }
    ]
  },
  {
    id: 'pqrs',
    title: 'PQRS',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'pqrs',
        title: 'PQRS',
        type: 'item',
        url: '/analytics',
        icon: 'feather icon-home'
      }
    ]
  },
  // {
  //   id: 'navigation',
  //   title: 'Navigation',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'dashboard',
  //       title: 'Dashboard',
  //       type: 'item',
  //       url: '/analytics',
  //       icon: 'feather icon-home'
  //     }
  //   ]
  // },
  // {
  //   id: 'ui-component',
  //   title: 'Ui Component',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'basic',
  //       title: 'Component',
  //       type: 'collapse',
  //       icon: 'feather icon-box',
  //       children: [
  //         {
  //           id: 'button',
  //           title: 'Button',
  //           type: 'item',
  //           url: '/component/button'
  //         },
  //         {
  //           id: 'badges',
  //           title: 'Badges',
  //           type: 'item',
  //           url: '/component/badges'
  //         },
  //         {
  //           id: 'breadcrumb-pagination',
  //           title: 'Breadcrumb & Pagination',
  //           type: 'item',
  //           url: '/component/breadcrumb-paging'
  //         },
  //         {
  //           id: 'collapse',
  //           title: 'Collapse',
  //           type: 'item',
  //           url: '/component/collapse'
  //         },
  //         {
  //           id: 'tabs-pills',
  //           title: 'Tabs & Pills',
  //           type: 'item',
  //           url: '/component/tabs-pills'
  //         },
  //         {
  //           id: 'typography',
  //           title: 'Typography',
  //           type: 'item',
  //           url: '/component/typography'
  //         }
  //       ]
  //     }
  //   ]
  //  },
  // {
  //   id: 'Authentication',
  //   title: 'Authentication',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'signup',
  //       title: 'Sign up',
  //       type: 'item',
  //       url: '/auth/signup',
  //       icon: 'feather icon-at-sign',
  //       target: true,
  //       breadcrumbs: false
  //     },
  //     {
  //       id: 'signin',
  //       title: 'Sign in',
  //       type: 'item',
  //       url: '/auth/signin',
  //       icon: 'feather icon-log-in',
  //       target: true,
  //       breadcrumbs: false
  //     }
  //   ]
  // },
  // {
  //   id: 'chart',
  //   title: 'Chart',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'apexchart',
  //       title: 'ApexChart',
  //       type: 'item',
  //       url: '/chart',
  //       classes: 'nav-item',
  //       icon: 'feather icon-pie-chart'
  //     }
  //   ]
  // },
  // {
  //   id: 'forms & tables',
  //   title: 'Forms & Tables',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'forms',
  //       title: 'Basic Elements',
  //       type: 'item',
  //       url: '/forms',
  //       classes: 'nav-item',
  //       icon: 'feather icon-file-text'
  //     },
  //     {
  //       id: 'tables',
  //       title: 'tables',
  //       type: 'item',
  //       url: '/tables',
  //       classes: 'nav-item',
  //       icon: 'feather icon-server'
  //     }
  //   ]
  // }
];
