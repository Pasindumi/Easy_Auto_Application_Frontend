const fs = require('fs');
const path = 'e:\\\\PROJECTS\\\\Easy Auto Car App\\\\Easy_Auto_Application_Frontend\\\\Easy_Auto_Frontend\\\\app\\\\(tabs)\\\\search.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /  \/\/ Fetch initial data[\s\S]*?\}, \[\]\);/,
  `  // Fetch initial data\n  useEffect(() => {\n    fetchVehicleTypes();\n  }, []);`
);

content = content.replace(
  /  const fetchConditions = async \(\) => \{[\s\S]*?console\.error\("Error fetching conditions:", error\);\n    \}\n  \};/,
  `  const fetchConditions = async () => {\n    try {\n      if (!selectedCategory || selectedCategory === 'all') return;\n      const res = await api.get(\`/api/vehicle-config/conditions/\${selectedCategory}\`);\n      if (Array.isArray(res)) {\n        setConditions(res.map(c => ({ label: c.condition_name, value: c.id })));\n      }\n    } catch (error) {\n      console.error("Error fetching conditions:", error);\n    }\n  };`
);

content = content.replace(
  /  \/\/ Fetch brands when category changes[\s\S]*?\}, \[selectedCategory\]\);/,
  `  // Fetch brands when category changes\n  useEffect(() => {\n    if (selectedCategory && selectedCategory !== 'all') {\n      fetchBrands();\n      fetchConditions();\n    } else {\n      setBrands([]);\n      setSelectedBrand('');\n      setConditions([]);\n      setSelectedCondition('');\n    }\n  }, [selectedCategory]);`
);

fs.writeFileSync(path, content, 'utf8');
