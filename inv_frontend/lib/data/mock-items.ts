// Mock data for inventory items
export const mockItems = [
  // Tangible Items - Computers
  {
    id: "T001",
    name: "Dell Latitude 5420",
    category: "Computers",
    type: "Tangible",
    department: "IT Department",
    quantity: 15,
    value: 85000,
    status: "Active",
    purchaseDate: "2023-01-15",
    location: "Main Office",
    vendor: "Dell Technologies",
  },
  {
    id: "T002",
    name: "HP EliteBook",
    category: "Computers",
    type: "Tangible",
    department: "Finance Department",
    quantity: 8,
    value: 72000,
    status: "Active",
    purchaseDate: "2023-02-10",
    location: "Main Office",
    vendor: "HP Inc.",
  },
  {
    id: "T003",
    name: "MacBook Pro",
    category: "Computers",
    type: "Tangible",
    department: "Design Team",
    quantity: 5,
    value: 150000,
    status: "Active",
    purchaseDate: "2023-03-05",
    location: "Design Studio",
    vendor: "Apple Inc.",
  },

  // Tangible Items - Furniture
  {
    id: "T004",
    name: "Office Desk",
    category: "Furniture",
    type: "Tangible",
    department: "All Departments",
    quantity: 25,
    value: 12000,
    status: "Active",
    purchaseDate: "2023-01-20",
    location: "Main Office",
    vendor: "IKEA",
  },
  {
    id: "T005",
    name: "Ergonomic Chair",
    category: "Furniture",
    type: "Tangible",
    department: "All Departments",
    quantity: 25,
    value: 18000,
    status: "Active",
    purchaseDate: "2023-01-20",
    location: "Main Office",
    vendor: "Herman Miller",
  },
  {
    id: "T006",
    name: "Conference Table",
    category: "Furniture",
    type: "Tangible",
    department: "Admin Department",
    quantity: 2,
    value: 35000,
    status: "Active",
    purchaseDate: "2023-02-15",
    location: "Conference Room",
    vendor: "Steelcase",
  },

  // Tangible Items - Office Equipment
  {
    id: "T007",
    name: "Projector",
    category: "Office Equipment",
    type: "Tangible",
    department: "Admin Department",
    quantity: 3,
    value: 45000,
    status: "Active",
    purchaseDate: "2023-03-10",
    location: "Conference Room",
    vendor: "Epson",
  },
  {
    id: "T008",
    name: "Printer",
    category: "Office Equipment",
    type: "Tangible",
    department: "All Departments",
    quantity: 5,
    value: 28000,
    status: "Maintenance",
    purchaseDate: "2023-01-25",
    location: "Main Office",
    vendor: "HP Inc.",
  },
  {
    id: "T009",
    name: "Scanner",
    category: "Office Equipment",
    type: "Tangible",
    department: "Admin Department",
    quantity: 2,
    value: 15000,
    status: "Active",
    purchaseDate: "2023-02-05",
    location: "Main Office",
    vendor: "Canon",
  },

  // Intangible Items - Software
  {
    id: "I001",
    name: "Microsoft Office 365",
    category: "Software",
    type: "Intangible",
    department: "All Departments",
    quantity: 50,
    value: 250000,
    status: "Active",
    purchaseDate: "2023-01-10",
    expiryDate: "2024-01-10",
    vendor: "Microsoft",
  },
  {
    id: "I002",
    name: "Adobe Creative Cloud",
    category: "Software",
    type: "Intangible",
    department: "Design Team",
    quantity: 8,
    value: 180000,
    status: "Active",
    purchaseDate: "2023-02-15",
    expiryDate: "2024-02-15",
    vendor: "Adobe Inc.",
  },
  {
    id: "I003",
    name: "Zoom Enterprise",
    category: "Software",
    type: "Intangible",
    department: "All Departments",
    quantity: 1,
    value: 75000,
    status: "Active",
    purchaseDate: "2023-03-01",
    expiryDate: "2024-03-01",
    vendor: "Zoom Video Communications",
  },

  // Intangible Items - Licenses
  {
    id: "I004",
    name: "Windows 11 Pro",
    category: "Licenses",
    type: "Intangible",
    department: "IT Department",
    quantity: 30,
    value: 120000,
    status: "Active",
    purchaseDate: "2023-01-15",
    expiryDate: "Perpetual",
    vendor: "Microsoft",
  },
  {
    id: "I005",
    name: "Antivirus Software",
    category: "Licenses",
    type: "Intangible",
    department: "IT Department",
    quantity: 50,
    value: 75000,
    status: "Active",
    purchaseDate: "2023-02-10",
    expiryDate: "2024-02-10",
    vendor: "Symantec",
  },
  {
    id: "I006",
    name: "Database License",
    category: "Licenses",
    type: "Intangible",
    department: "IT Department",
    quantity: 5,
    value: 180000,
    status: "Active",
    purchaseDate: "2023-03-15",
    expiryDate: "2024-03-15",
    vendor: "Oracle",
  },

  // Intangible Items - Subscriptions
  {
    id: "I007",
    name: "Cloud Storage",
    category: "Subscriptions",
    type: "Intangible",
    department: "All Departments",
    quantity: 1,
    value: 120000,
    status: "Active",
    purchaseDate: "2023-01-05",
    expiryDate: "2024-01-05",
    vendor: "Amazon Web Services",
  },
  {
    id: "I008",
    name: "Project Management Tool",
    category: "Subscriptions",
    type: "Intangible",
    department: "All Departments",
    quantity: 1,
    value: 85000,
    status: "Active",
    purchaseDate: "2023-02-20",
    expiryDate: "2024-02-20",
    vendor: "Atlassian",
  },
  {
    id: "I009",
    name: "CRM Software",
    category: "Subscriptions",
    type: "Intangible",
    department: "Sales Department",
    quantity: 15,
    value: 150000,
    status: "Active",
    purchaseDate: "2023-03-10",
    expiryDate: "2024-03-10",
    vendor: "Salesforce",
  },
]

export const getItemsByType = (type: "Tangible" | "Intangible") => {
  return mockItems.filter((item) => item.type === type)
}

export const getItemsByCategory = (category: string) => {
  return mockItems.filter((item) => item.category === category)
}

export const getItemsByDepartment = (department: string) => {
  return mockItems.filter((item) => item.department === department)
}

export const getTotalItemsValue = () => {
  return mockItems.reduce((sum, item) => sum + item.value, 0)
}

export const getTotalItemsCount = () => {
  return mockItems.reduce((sum, item) => sum + item.quantity, 0)
}

export const getCategorySummary = () => {
  const categories = [...new Set(mockItems.map((item) => item.category))]

  return categories.map((category) => {
    const categoryItems = mockItems.filter((item) => item.category === category)
    const tangibleItems = categoryItems.filter((item) => item.type === "Tangible")
    const intangibleItems = categoryItems.filter((item) => item.type === "Intangible")

    return {
      category,
      totalItems: categoryItems.length,
      totalValue: categoryItems.reduce((sum, item) => sum + item.value, 0),
      tangibleCount: tangibleItems.length,
      tangibleValue: tangibleItems.reduce((sum, item) => sum + item.value, 0),
      intangibleCount: intangibleItems.length,
      intangibleValue: intangibleItems.reduce((sum, item) => sum + item.value, 0),
    }
  })
}

