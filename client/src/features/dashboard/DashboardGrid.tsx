import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { motion, AnimatePresence } from 'framer-motion';
import { WidgetRegistry } from '@/lib/WidgetRegistry';
import { useUserType } from '@/hooks/useUserType';
import { useState, useEffect } from 'react';
import { WidgetModule } from '@/lib/WidgetTypes';

const softSpring = {
  type: 'spring' as const,
  stiffness: 240,
  damping: 18,
  mass: 0.9,
};

interface SortableWidgetProps {
  id: string;
  widget: WidgetModule;
  isDragOverlay?: boolean;
}

const SortableWidget = ({ id, widget, isDragOverlay = false }: SortableWidgetProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id,
    disabled: isDragOverlay,
  });

  const WidgetComponent = widget.component;

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  const content = (
    <WidgetComponent className={isDragOverlay ? 'opacity-90' : ''} />
  );

  if (isDragOverlay) {
    return (
      <motion.div
        style={style}
        animate={{
          scale: 1.03,
          rotate: 2,
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
        }}
        transition={softSpring}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      layout
      animate={{
        scale: isDragging ? 1.02 : 1,
        rotate: isDragging ? 1 : 0,
        boxShadow: isDragging
          ? '0 8px 30px rgba(0,0,0,0.3)'
          : '0 2px 12px rgba(0,0,0,0.08)',
      }}
      transition={softSpring}
      style={style}
      className="cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      {content}
    </motion.div>
  );
};

export function DashboardGrid() {
  const userType = useUserType();
  const availableWidgets = WidgetRegistry.getWidgetsForUserType(userType);
  const [layout, setLayout] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Initialize layout with available widgets
  useEffect(() => {
    const storageKey = `dashboard-layout-${userType}`;
    const savedLayout = localStorage.getItem(storageKey);
    
    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout);
        // Validate that all widgets still exist
        const validWidgets = parsed.filter((id: string) => 
          availableWidgets.some(w => w.id === id)
        );
        if (validWidgets.length > 0) {
          setLayout(validWidgets);
          return;
        }
      } catch (e) {
        console.warn('Failed to parse saved layout:', e);
      }
    }
    
    // Fallback to default layout
    const widgetIds = availableWidgets.map(w => w.id);
    setLayout(widgetIds);
  }, [userType]); // Remove availableWidgets dependency to prevent re-renders

  const saveLayout = (newLayout: string[]) => {
    const storageKey = `dashboard-layout-${userType}`;
    localStorage.setItem(storageKey, JSON.stringify(newLayout));
    setLayout(newLayout);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    
    if (!over || active.id === over.id) return;
    
    const oldIndex = layout.indexOf(active.id as string);
    const newIndex = layout.indexOf(over.id as string);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const newLayout = arrayMove(layout, oldIndex, newIndex);
      saveLayout(newLayout);
    }
  };

  const activeWidget = activeId ? WidgetRegistry.getWidget(activeId) : null;

  if (layout.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      modifiers={[snapCenterToCursor]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={layout} strategy={rectSortingStrategy}>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pb-24 md:pb-16 max-w-screen-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {layout.map((widgetId) => {
              const widget = WidgetRegistry.getWidget(widgetId);
              if (!widget) return null;
              
              return (
                <SortableWidget 
                  key={widgetId} 
                  id={widgetId} 
                  widget={widget}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      </SortableContext>
      
      <DragOverlay>
        {activeWidget && (
          <SortableWidget 
            id={activeId!} 
            widget={activeWidget} 
            isDragOverlay 
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}