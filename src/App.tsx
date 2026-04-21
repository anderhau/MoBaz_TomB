/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, 
  SortAsc, 
  SortDesc, 
  Calendar, 
  Moon, 
  Sun
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { BOULDERS } from './data';
import { Boulder } from './types';
import { getSortValue } from './lib/gradeUtils';

import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from './components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from './components/ui/dialog';
import { buttonVariants } from './components/ui/button';
import { ScrollArea } from './components/ui/scroll-area';
import { Separator } from './components/ui/separator';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SortOption = 'date-desc' | 'date-asc' | 'grade-desc' | 'grade-asc';
type GradeSystemDisplay = 'font' | 'v';

export default function App() {
  const [sort, setSort] = useState<SortOption>('date-desc');
  const [gradeSystem, setGradeSystem] = useState<GradeSystemDisplay>('v');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredAndSortedBoulders = useMemo(() => {
    let result = [...BOULDERS];

    // Sort
    result.sort((a, b) => {
      switch (sort) {
        case 'date-desc':
          return parseISO(b.date).getTime() - parseISO(a.date).getTime();
        case 'date-asc':
          return parseISO(a.date).getTime() - parseISO(b.date).getTime();
        case 'grade-desc': {
          const valA = getSortValue(gradeSystem === 'v' ? a.vGrade : a.fontGrade, gradeSystem);
          const valB = getSortValue(gradeSystem === 'v' ? b.vGrade : b.fontGrade, gradeSystem);
          return valB - valA;
        }
        case 'grade-asc': {
          const valA = getSortValue(gradeSystem === 'v' ? a.vGrade : a.fontGrade, gradeSystem);
          const valB = getSortValue(gradeSystem === 'v' ? b.vGrade : b.fontGrade, gradeSystem);
          return valA - valB;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [sort, gradeSystem]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">MoBaz <span className="text-primary">TomB</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">The Falling Archive</p>
            </div>
          </div>
          
          <div className="flex-1"></div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl mx-auto py-6 px-4 md:px-8 mb-20 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 font-heading">Boulders</h1>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 sm:flex-none gap-2 rounded-lg")}>
                <Filter className="h-4 w-4" />
                System: <span className="font-bold underline uppercase">{gradeSystem}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Grade System</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setGradeSystem('v')}>V-Grades</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setGradeSystem('font')}>Font-Grades</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 sm:flex-none gap-2 rounded-lg")}>
                <SortAsc className="h-4 w-4" />
                Sort
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSort('date-desc')} className="flex justify-between">
                    Latest First <Calendar className="h-3 w-3 opacity-50" />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSort('date-asc')} className="flex justify-between">
                    Oldest First <Calendar className="h-3 w-3 opacity-50" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSort('grade-desc')} className="flex justify-between">
                    Hardest First <SortDesc className="h-3 w-3 opacity-50" />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSort('grade-asc')} className="flex justify-between">
                    Easiest First <SortAsc className="h-3 w-3 opacity-50" />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedBoulders.map((boulder, index) => (
              <motion.div
                key={boulder.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="group overflow-hidden bg-card border-border border rounded-2xl hover:shadow-2xl transition-all duration-500">
                  <div className="relative aspect-3/4 overflow-hidden">
                    <Dialog>
                      <DialogTrigger render={<button className="w-full h-full cursor-zoom-in outline-none" />}>
                        <img 
                          src={boulder.imageUrl} 
                          alt={boulder.name}
                          referrerPolicy="no-referrer"
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                        <DialogTitle className="sr-only">{boulder.name} image</DialogTitle>
                        <img 
                          src={boulder.imageUrl} 
                          alt={boulder.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <div className="absolute inset-0 bg-linear-to-t pointer-events-none from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                       <p className="text-white text-xs font-medium flex items-center gap-1">
                         <Calendar className="h-3 w-3" />
                         {format(parseISO(boulder.date), 'MMM do, yyyy')}
                       </p>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-4">
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={cn("font-mono text-4xl font-black tracking-tighter drop-shadow-sm", gradeSystem === 'v' ? "text-amber-500" : "text-blue-500")}>
                          {gradeSystem === 'v' ? boulder.vGrade : boulder.fontGrade}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between w-full">
                        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{boulder.name}</CardTitle>
                        <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1 font-medium bg-secondary/30 px-1.5 py-0.5 rounded">
                          <Calendar className="h-3 w-3 inline" />
                          {format(parseISO(boulder.date), 'MMM do, yyyy')}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredAndSortedBoulders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="border border-dashed border-border p-8 rounded-2xl mb-4 bg-card">
               <div className="text-muted-foreground text-xs font-medium bg-secondary/50 px-4 py-2 rounded-lg">+ Add First Missing Send</div>
            </div>
            <h2 className="text-xl font-bold">No boulders found</h2>
            <p className="text-muted-foreground max-w-sm mt-2 font-italics">
              Try adjusting your filters to see more beta.
            </p>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-border mt-12 bg-background">
        <div className="container text-center px-4">
          <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">Designed for your bouldering needs</p>
          <div className="mt-4 flex justify-center gap-6 opacity-30">
             <div className="w-8 h-8 rounded-lg bg-card border border-border" />
             <div className="w-8 h-8 rounded-lg bg-card border border-border" />
             <div className="w-8 h-8 rounded-lg bg-card border border-border" />
          </div>
        </div>
      </footer>
    </div>
  );
}

