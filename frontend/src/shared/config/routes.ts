const routes = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
  },
  report: {
    getReports: '/report',
    createReport: '/report',
    updateReport: (id: string) => `/report/${id}`,
    deleteReport: (id: string) => `/report/${id}`,
  },
  equipment: {
    getAllEquipments: '/equipments',
    getEquipmentById: (id: string) => `/equipments/${id}`,
    createEquipment: '/equipments',
    updateEquipment: (id: string) => `/equipments/${id}`,
    deleteEquipment: (id: string) => `/equipments/${id}`,
  },
  inventory: {
    getInventories: '/inventory',
    createInventory: '/inventory',
    updateInventory: (id: string) => `/inventory/${id}`,
    deleteInventory: (id: string) => `/inventory/${id}`,
  },
  maintenance: {
    getMaintenance: '/maintance',
    createMaintenance: '/maintance',
    updateMaintenance: (id: string) => `/maintance/${id}`,
    deleteMaintenance: (id: string) => `/maintance/${id}`,
  },
};

export default routes;