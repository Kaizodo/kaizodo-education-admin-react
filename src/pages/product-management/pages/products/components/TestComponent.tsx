import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CommonProductStateProps } from './ProductEditorForm';

// --- TYPE DEFINITIONS ---
// Types are defined here as requested to be available for the component
export type Module = {
    id: number,
    name: string,
    description: string
}

export type ModuleFeature = {
    id: number,
    module_id: number,
    name: string,
    description: string
}

export type ProductModuleFeature = {
    product_id: number, // Assuming product ID is constant for this component's context
    module_id: number,
    module_feature_id: number
}

export type ProductState = {
    modules: Module[],
    module_features: ModuleFeature[],
    product_module_fetures: ProductModuleFeature[],
}

// --- MOCK DATA SIMULATION (Larger Dataset for Pagination) ---

const TOTAL_MODULE_COUNT = 8;
const MODULE_LOAD_LIMIT = 3;
const FEATURE_LOAD_LIMIT = 3;

// Generate mock data for a larger scale
const generateModules = (count: number): Module[] =>
    Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Service Module ${i + 1}`,
        description: `Comprehensive description for core service module number ${i + 1}.`,
    }));

const generateFeatures = (moduleId: number, count: number): ModuleFeature[] =>
    Array.from({ length: count }, (_, i) => ({
        id: moduleId * 100 + i + 1,
        module_id: moduleId,
        name: `Feature ${i + 1} for M${moduleId}`,
        description: `Specific capability for module ${moduleId}.`,
    }));

const ALL_MODULES: Module[] = generateModules(TOTAL_MODULE_COUNT);

// Create more features per module (between 4 and 6 features each)
const ALL_FEATURES: ModuleFeature[] = ALL_MODULES.flatMap(m => {
    const featureCount = m.id < 3 ? 6 : 4; // Make some modules have more features than others
    return generateFeatures(m.id, featureCount);
});

// Initial state (as requested, no modules are initially selected)
const INITIAL_STATE: ProductState = {
    modules: [],
    module_features: [],
    product_module_fetures: [],
};

// --- HELPER FUNCTIONS ---

// Converts ProductState structure into a map for easier component state management
// Map structure: { moduleId: Set<featureId> }
const stateToSelectionMap = (state: ProductState): Record<number, Set<number>> => {
    // This function remains largely the same, mapping the initial state structure
    const simplifiedMap: Record<number, Set<number>> = {};
    state.module_features.reduce((acc, feature) => {
        if (!acc[feature.module_id]) {
            acc[feature.module_id] = new Set();
        }
        if (state.product_module_fetures.some(pmf => pmf.module_feature_id === feature.id)) {
            acc[feature.module_id].add(feature.id);
        }
        return acc;
    }, simplifiedMap);

    return simplifiedMap;
};


// --- CORE COMPONENT ---

// Define the shape for the user's selection state
type SelectionMap = Record<number, Set<number>>;

const FeatureCheckbox: React.FC<{
    feature: ModuleFeature,
    isSelected: boolean,
    onToggle: () => void
}> = ({ feature, isSelected, onToggle }) => (
    <div
        className={`flex items-start p-3 transition-all duration-200 border rounded-lg cursor-pointer hover:shadow-md ${isSelected
            ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500'
            : 'bg-white border-gray-200 hover:border-indigo-300'
            }`}
        onClick={onToggle}
    >
        <input
            type="checkbox"
            checked={isSelected}
            readOnly
            className="w-5 h-5 mt-1 mr-3 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <div className="flex-grow">
            <p className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                {feature.name}
            </p>
            <p className="text-sm text-gray-500">
                {feature.description}
            </p>
        </div>
    </div>
);

// --- Module Selector Component ---
export default function ProductModuleInformation({ state }: CommonProductStateProps) {

    // Selection State: { moduleId: Set<featureId> } - Tracks ALL user selections, regardless of loading state
    const [selectedFeaturesMap, setSelectedFeaturesMap] = useState<SelectionMap>(() => stateToSelectionMap(state));

    // UI state for showing the configuration modal
    const [isConfiguring, setIsConfiguring] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Mock loading state

    // Pagination State
    // Modules currently loaded/visible in the configuration modal
    const [visibleModules, setVisibleModules] = useState<Module[]>([]);
    // Tracks how many features are visible per module: { moduleId: featureCount }
    const [featureLimits, setFeatureLimits] = useState<Record<number, number>>({});

    // --- LOGIC FUNCTIONS ---

    // Function to load the next batch of modules
    const loadMoreModules = useCallback(() => {
        setIsLoading(true);
        const currentCount = visibleModules.length;
        const nextBatch = ALL_MODULES.slice(currentCount, currentCount + MODULE_LOAD_LIMIT);

        // Simulate network delay
        setTimeout(() => {
            setVisibleModules(prev => [...prev, ...nextBatch]);
            setIsLoading(false);
        }, 500);
    }, [visibleModules.length]);

    // Function to load the initial batch of modules and open the modal
    const loadInitialModules = () => {
        // Reset feature limits when opening the modal (optional, but good for fresh views)
        setFeatureLimits({});
        // Load the first batch
        loadMoreModules();
        setIsConfiguring(true); // Open the configuration view
    };

    // Function to load more features for a specific module
    const loadMoreFeatures = (moduleId: number) => {
        setFeatureLimits(prev => {
            const currentLimit = prev[moduleId] || FEATURE_LOAD_LIMIT;
            return {
                ...prev,
                [moduleId]: currentLimit + FEATURE_LOAD_LIMIT
            };
        });
    };

    // Toggle a single feature's selection status
    const toggleFeature = (moduleId: number, featureId: number) => {
        setSelectedFeaturesMap(prevMap => {
            const newMap = { ...prevMap };

            // Ensure the module key exists in the map
            if (!newMap[moduleId]) {
                newMap[moduleId] = new Set();
            }

            const features = newMap[moduleId];

            if (features.has(featureId)) {
                // If selected, unselect it
                features.delete(featureId);
                // If all features in a module are unselected, remove the module key
                if (features.size === 0) {
                    delete newMap[moduleId];
                }
            } else {
                // If unselected, select it
                features.add(featureId);
            }
            return newMap;
        });
    };

    // Toggle a whole module (selects/unselects all its features)
    const toggleModule = (moduleId: number) => {
        const moduleFeatures = ALL_FEATURES.filter(f => f.module_id === moduleId);
        const isModuleSelected = !!selectedFeaturesMap[moduleId] && selectedFeaturesMap[moduleId].size > 0;

        setSelectedFeaturesMap(prevMap => {
            const newMap = { ...prevMap };

            if (isModuleSelected) {
                // UNSELECT: Remove the module entirely
                delete newMap[moduleId];
            } else {
                // SELECT: Add all features of this module
                newMap[moduleId] = new Set(moduleFeatures.map(f => f.id));
                // Ensure all features of this module are visible after selection (for UX)
                setFeatureLimits(prev => ({
                    ...prev,
                    [moduleId]: moduleFeatures.length
                }));
            }
            return newMap;
        });
    };

    // --- DERIVED/MEMOIZED STATE ---

    // Get the list of selected module IDs
    const selectedModuleIds = useMemo(() => Object.keys(selectedFeaturesMap).map(id => Number(id)), [selectedFeaturesMap]);

    // Get the actual Module objects that are currently selected (uses ALL_MODULES for display)
    const selectedModules = useMemo(() =>
        ALL_MODULES.filter(m => selectedModuleIds.includes(m.id)),
        [selectedModuleIds]
    );

    // Check if any modules are selected
    const hasSelectedModules = selectedModules.length > 0;


    // --- RENDERING COMPONENTS ---

    const RenderSelectedModules = () => {
        if (!hasSelectedModules) {
            return (
                <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7s4 2.21 8 2.21 8-2.21 8-2.21" />
                    </svg>
                    <p className="font-medium">No Modules Selected</p>
                    <p className="text-sm">Click "Add/Edit Modules" to begin configuration.</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {selectedModules.map(module => {
                    const selectedFeatureIds = selectedFeaturesMap[module.id] || new Set();
                    // Filter features using ALL_FEATURES to display all selected features
                    const features = ALL_FEATURES.filter(f => f.module_id === module.id && selectedFeatureIds.has(f.id));

                    if (features.length === 0) return null;

                    return (
                        <div key={module.id} className="p-5 border border-indigo-200 bg-indigo-50 rounded-xl shadow-lg">
                            <h3 className="mb-3 text-xl font-bold text-indigo-700">{module.name}</h3>
                            <p className="mb-4 text-gray-600">{module.description}</p>

                            <h4 className="mb-2 text-sm font-semibold tracking-wider text-indigo-600 uppercase">Selected Features ({features.length})</h4>
                            <ul className="space-y-3">
                                {features.map(feature => (
                                    <li key={feature.id} className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium text-gray-700">{feature.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        );
    };

    const RenderModuleConfiguration = () => {
        const hasMoreModules = visibleModules.length < ALL_MODULES.length;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 backdrop-blur-sm">
                <div className="flex items-start justify-center min-h-screen px-4 pt-12 pb-20 sm:p-0">
                    <div className="relative w-full max-w-4xl p-8 my-8 transition-all transform bg-white shadow-2xl rounded-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-extrabold text-gray-900">Configure Product Modules</h2>
                            <button
                                onClick={() => setIsConfiguring(false)}
                                className="p-2 text-gray-400 transition-colors duration-150 rounded-full hover:bg-gray-100 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-10 max-h-[70vh] overflow-y-auto pr-4">
                            {visibleModules.length === 0 && !isLoading ? (
                                <div className="p-10 text-center text-gray-500 bg-gray-100 rounded-lg">
                                    <h3 className="text-xl font-semibold">No Available Modules</h3>
                                    <p>The database returned no modules to configure.</p>
                                </div>
                            ) : (
                                visibleModules.map(module => {
                                    // Filter ALL_FEATURES to get the full list for this module
                                    const allModuleFeatures = ALL_FEATURES.filter(f => f.module_id === module.id);

                                    // Get the current limit for visible features (defaults to initial limit)
                                    const currentFeatureLimit = featureLimits[module.id] || FEATURE_LOAD_LIMIT;

                                    // Get only the visible features for rendering
                                    const visibleModuleFeatures = allModuleFeatures.slice(0, currentFeatureLimit);

                                    const currentSelectedFeatures = selectedFeaturesMap[module.id] || new Set();
                                    const isModuleSelected = currentSelectedFeatures.size > 0;
                                    const isAllFeaturesSelected = allModuleFeatures.every(f => currentSelectedFeatures.has(f.id));
                                    const hasMoreFeatures = visibleModuleFeatures.length < allModuleFeatures.length;

                                    return (
                                        <div key={module.id} className="p-6 transition-shadow duration-300 border rounded-xl hover:shadow-lg">
                                            {/* Module Header & Toggle */}
                                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                                                <div className='flex items-center'>
                                                    <input
                                                        type="checkbox"
                                                        checked={isModuleSelected}
                                                        onChange={() => toggleModule(module.id)}
                                                        className="w-5 h-5 mr-3 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <h3 className="text-2xl font-bold text-gray-800">{module.name}</h3>
                                                    {isAllFeaturesSelected && (
                                                        <span className="px-3 py-1 ml-3 text-xs font-medium text-white bg-green-500 rounded-full">All Selected</span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="mb-5 text-gray-600">{module.description}</p>

                                            {/* Features List */}
                                            <h4 className="mb-3 text-sm font-semibold tracking-wider text-gray-500 uppercase">Select Features</h4>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {visibleModuleFeatures.map(feature => (
                                                    <FeatureCheckbox
                                                        key={feature.id}
                                                        feature={feature}
                                                        isSelected={currentSelectedFeatures.has(feature.id)}
                                                        onToggle={() => toggleFeature(module.id, feature.id)}
                                                    />
                                                ))}
                                            </div>

                                            {/* Load More Features Button */}
                                            {hasMoreFeatures && (
                                                <button
                                                    onClick={() => loadMoreFeatures(module.id)}
                                                    className="w-full mt-4 py-2 text-indigo-600 bg-indigo-50 border border-indigo-300 rounded-lg hover:bg-indigo-100 transition duration-150 text-sm font-semibold"
                                                >
                                                    Load More Features ({allModuleFeatures.length - visibleModuleFeatures.length} remaining)
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                            )}

                            {/* Load More Modules Button */}
                            {isLoading && (
                                <div className="p-6 text-center text-indigo-600">
                                    <svg className="w-6 h-6 mx-auto animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p className="mt-2 text-sm">Loading more modules...</p>
                                </div>
                            )}

                            {hasMoreModules && !isLoading && (
                                <button
                                    onClick={loadMoreModules}
                                    className="w-full px-6 py-3 text-lg font-semibold text-indigo-600 transition duration-150 border-2 border-indigo-600 rounded-xl hover:bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                                >
                                    Load More Modules ({ALL_MODULES.length - visibleModules.length} remaining)
                                </button>
                            )}

                            {!hasMoreModules && !isLoading && visibleModules.length > 0 && (
                                <p className="pt-2 text-center text-sm text-gray-500">
                                    All available modules have been loaded.
                                </p>
                            )}
                        </div>

                        <div className="pt-6 mt-6 border-t border-gray-200">
                            <button
                                onClick={() => setIsConfiguring(false)}
                                className="w-full px-6 py-3 text-lg font-semibold text-white transition duration-150 bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                            >
                                Save Configuration ({selectedModuleIds.length} Modules Selected)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen p-4 sm:p-8 bg-gray-50 font-sans">
            <script src="https://cdn.tailwindcss.com"></script>
            {/* Tailwind Config for the 'Inter' font and custom colors */}
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
                .font-sans { font-family: 'Inter', sans-serif; }
                `}
            </style>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <div className="max-w-4xl mx-auto">
                <header className="mb-8 pb-4 border-b border-gray-200 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Product Feature Selector
                    </h1>
                    <button
                        onClick={loadInitialModules}
                        disabled={isLoading && isConfiguring === false} // Only disable if loading and not already in modal
                        className="flex items-center px-4 py-2 text-sm font-semibold text-white transition duration-150 bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isLoading && isConfiguring === false ? (
                            <>
                                <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Add/Edit Modules
                            </>
                        )}
                    </button>
                </header>

                <main>
                    <h2 className="mb-4 text-2xl font-bold text-gray-800">Current Configuration</h2>
                    {RenderSelectedModules()}
                </main>
            </div>

            {/* Configuration Modal */}
            {isConfiguring && RenderModuleConfiguration()}
        </div>
    );
}