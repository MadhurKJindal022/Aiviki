import React, { useState, useMemo } from "react";
import { Search, Filter, Star, ExternalLink, Zap, Brain, Code, Image, Video, FileText, Wrench, Info, Plus, X, Eye, EyeOff, ChevronDown, ChevronUp, Edit, LogIn, LogOut, User, Heart, Palette, Music, Blocks, Sparkles, Box } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";
import AuthModal from "../components/AuthModal";
import { mockAITools } from "../data/mockData";

const categories = [
  { id: 'all', name: 'All Tools', icon: Brain, color: 'from-cyan-500 to-blue-500' },
  { id: 'text-generation', name: 'Text Generation', icon: FileText, color: 'from-cyan-500 to-blue-500' },
  { id: 'image-generation', name: 'Image Generation', icon: Image, color: 'from-green-500 to-emerald-500' },
  { id: 'code-assistant', name: 'Code Assistant', icon: Code, color: 'from-orange-500 to-red-500' },
  { id: 'video-audio', name: 'Video & Audio', icon: Video, color: 'from-purple-500 to-indigo-500' },
  { id: 'research', name: 'Research', icon: Brain, color: 'from-yellow-500 to-orange-500' },
  { id: 'productivity', name: 'Productivity', icon: Zap, color: 'from-pink-500 to-rose-500' },
  { id: 'design', name: 'Design', icon: Palette, color: 'from-teal-500 to-cyan-500' },
  { id: 'music', name: 'Music Generation', icon: Music, color: 'from-indigo-500 to-purple-500' },
  { id: 'app-builder', name: 'App Builder', icon: Blocks, color: 'from-emerald-500 to-teal-500' },
  { id: 'manga-anime', name: 'Manga & Anime', icon: Sparkles, color: 'from-pink-500 to-purple-500' },
  { id: 'entertainment', name: 'Entertainment', icon: Heart, color: 'from-red-500 to-pink-500' },
  { id: '3d-animation', name: '3D & Animation', icon: Box, color: 'from-blue-500 to-indigo-500' }
];

const AIDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPricing, setSelectedPricing] = useState("all");
  const [showTags, setShowTags] = useState([]);
  const [hideTags, setHideTags] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("popular");
  const [tools, setTools] = useState(mockAITools);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [user, setUser] = useState(null);
  const [editingTool, setEditingTool] = useState(null);
  const [newTool, setNewTool] = useState({
    name: '',
    description: '',
    category: 'text-generation',
    tags: '',
    website: '',
    pricing: 'freemium',
    rating: 4.0,
    imageUrl: ''
  });

  // Get all unique tags from tools
  const allTags = useMemo(() => {
    const tags = new Set();
    tools.forEach(tool => {
      tool.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [tools]);

  // Filter and sort tools
  const filteredTools = useMemo(() => {
    let filtered = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
      const matchesPricing = selectedPricing === "all" || tool.pricing === selectedPricing;
      const matchesFavorites = !showFavoritesOnly || favorites.includes(tool.id);
      
      // Show tags filter - tool must have at least one of the selected show tags
      const matchesShowTags = showTags.length === 0 || 
                             showTags.some(tag => tool.tags.includes(tag));
      
      // Hide tags filter - tool must not have any of the selected hide tags
      const matchesHideTags = hideTags.length === 0 ||
                             !hideTags.some(tag => tool.tags.includes(tag));
      
      return matchesSearch && matchesCategory && matchesPricing && matchesShowTags && matchesHideTags && matchesFavorites;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return new Date(b.releaseYear) - new Date(a.releaseYear);
        default: // popular
          return b.popularity - a.popularity;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedPricing, showTags, hideTags, sortBy, tools, favorites, showFavoritesOnly]);

  const toggleShowTag = (tag) => {
    setShowTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleHideTag = (tag) => {
    setHideTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleFavorite = (toolId) => {
    setFavorites(prev => 
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    const IconComponent = category?.icon || Brain;
    return <IconComponent className="w-8 h-8" />;
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || 'from-gray-500 to-gray-600';
  };

  const handleLogin = (userData) => {
    setUser(userData);
    // Load user's favorites from localStorage if available
    const savedFavorites = localStorage.getItem(`favorites_${userData.email}`);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const handleLogout = () => {
    // Save favorites to localStorage before logging out
    if (user) {
      localStorage.setItem(`favorites_${user.email}`, JSON.stringify(favorites));
    }
    setUser(null);
    setFavorites([]);
    setShowFavoritesOnly(false);
  };

  const handleAddTool = () => {
    const tagsArray = newTool.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const toolToAdd = {
      id: Date.now(),
      ...newTool,
      tags: tagsArray,
      popularity: 50,
      releaseYear: new Date().getFullYear().toString()
    };
    
    setTools(prev => [...prev, toolToAdd]);
    setNewTool({
      name: '',
      description: '',
      category: 'text-generation',
      tags: '',
      website: '',
      pricing: 'freemium',
      rating: 4.0,
      imageUrl: ''
    });
    setIsAddModalOpen(false);
  };

  const handleEditTool = (tool) => {
    setEditingTool({
      ...tool,
      tags: tool.tags.join(', ')
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateTool = () => {
    const tagsArray = editingTool.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const updatedTool = {
      ...editingTool,
      tags: tagsArray
    };
    
    setTools(prev => prev.map(tool => 
      tool.id === editingTool.id ? updatedTool : tool
    ));
    setEditingTool(null);
    setIsEditModalOpen(false);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedPricing("all");
    setShowTags([]);
    setHideTags([]);
    setShowFavoritesOnly(false);
  };

  // Save favorites to localStorage when favorites change
  React.useEffect(() => {
    if (user && favorites.length > 0) {
      localStorage.setItem(`favorites_${user.email}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const favoriteCount = favorites.length;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex">
        {/* Animated background */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_70%)]"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Left Sidebar - Categories Dashboard */}
        <div className="relative z-10 w-80 bg-gray-800/40 backdrop-blur-sm border-r border-gray-700 p-6 overflow-y-auto">
          {/* User Authentication Section */}
          <div className="mb-8 p-4 bg-gray-700/30 rounded-lg">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-100">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                
                {/* Favorites Button */}
                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`w-full ${showFavoritesOnly 
                    ? 'bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white' 
                    : 'border-pink-500 text-pink-400 hover:bg-pink-500/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly || favorites.length > 0 ? 'fill-current' : ''}`} />
                  {showFavoritesOnly ? `My Favorites (${favoriteCount})` : `Favorites (${favoriteCount})`}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-600/50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In to Edit
              </Button>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
              Categories
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {categories.map(category => {
                const IconComponent = category.icon;
                const isSelected = selectedCategory === category.id;
                const toolCount = category.id === 'all' 
                  ? tools.length 
                  : tools.filter(tool => tool.category === category.id).length;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-r ${category.color} shadow-lg shadow-cyan-500/20 text-white` 
                        : 'bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                    <span className="text-xs opacity-75">({toolCount})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced Tag Filters */}
          <div className="mb-8">
            <Collapsible open={isAdvancedFilterOpen} onOpenChange={setIsAdvancedFilterOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between border-gray-600 text-gray-300 hover:bg-gray-700/50">
                  Advanced Filters
                  {isAdvancedFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                {/* Show Tags */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Eye className="w-4 h-4 text-green-400" />
                    <h4 className="text-sm font-semibold text-green-400">Show Tags ({showTags.length})</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {allTags.map(tag => (
                      <button
                        key={`show-${tag}`}
                        onClick={() => toggleShowTag(tag)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          showTags.includes(tag)
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hide Tags */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <EyeOff className="w-4 h-4 text-red-400" />
                    <h4 className="text-sm font-semibold text-red-400">Hide Tags ({hideTags.length})</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {allTags.map(tag => (
                      <button
                        key={`hide-${tag}`}
                        onClick={() => toggleHideTag(tag)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          hideTags.includes(tag)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Add Tool Button - Only show for logged in users */}
          {user && (
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Tool
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-gray-100 max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New AI Tool</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Add a new AI tool to the directory
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newTool.name}
                      onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                      className="bg-gray-700/50 border-gray-600"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      value={newTool.website}
                      onChange={(e) => setNewTool({...newTool, website: e.target.value})}
                      className="bg-gray-700/50 border-gray-600"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="imageUrl">Custom Image URL (Optional)</Label>
                    <Input
                      id="imageUrl"
                      value={newTool.imageUrl}
                      onChange={(e) => setNewTool({...newTool, imageUrl: e.target.value})}
                      className="bg-gray-700/50 border-gray-600"
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-xs text-gray-400 mt-1">Leave blank to use default category icon</p>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newTool.category} onValueChange={(value) => setNewTool({...newTool, category: value})}>
                      <SelectTrigger className="bg-gray-700/50 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {categories.slice(1).map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="pricing">Pricing</Label>
                    <Select value={newTool.pricing} onValueChange={(value) => setNewTool({...newTool, pricing: value})}>
                      <SelectTrigger className="bg-gray-700/50 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="freemium">Freemium</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={newTool.rating}
                      onChange={(e) => setNewTool({...newTool, rating: parseFloat(e.target.value)})}
                      className="bg-gray-700/50 border-gray-600"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={newTool.tags}
                      onChange={(e) => setNewTool({...newTool, tags: e.target.value})}
                      className="bg-gray-700/50 border-gray-600"
                      placeholder="AI, Writing, Productivity"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTool.description}
                      onChange={(e) => setNewTool({...newTool, description: e.target.value})}
                      className="bg-gray-700/50 border-gray-600"
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddTool}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                    disabled={!newTool.name || !newTool.website}
                  >
                    Add Tool
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative z-10 p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent mb-4">
              AI WIKI
            </h1>
            <p className="text-xl text-gray-300 mb-6">Discover the Future of Artificial Intelligence</p>
            
            {/* Search and Filters */}
            <div className="max-w-2xl space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search AI tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-100">
                    <SelectValue placeholder="Pricing" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Pricing</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-100">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                  onClick={clearAllFilters}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>

              {/* Active Filters Display */}
              {(showTags.length > 0 || hideTags.length > 0 || showFavoritesOnly) && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {showFavoritesOnly && (
                    <Badge className="bg-pink-600 hover:bg-pink-700 text-white">
                      <Heart className="w-3 h-3 mr-1 fill-current" />
                      Favorites Only
                      <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setShowFavoritesOnly(false)} />
                    </Badge>
                  )}
                  {showTags.map(tag => (
                    <Badge key={`show-${tag}`} className="bg-green-600 hover:bg-green-700 text-white">
                      <Eye className="w-3 h-3 mr-1" />
                      {tag}
                      <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => toggleShowTag(tag)} />
                    </Badge>
                  ))}
                  {hideTags.map(tag => (
                    <Badge key={`hide-${tag}`} className="bg-red-600 hover:bg-red-700 text-white">
                      <EyeOff className="w-3 h-3 mr-1" />
                      {tag}
                      <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => toggleHideTag(tag)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="mb-8">
            <p className="text-gray-400">
              {showFavoritesOnly 
                ? `Found ${filteredTools.length} favorite tool${filteredTools.length !== 1 ? 's' : ''}`
                : `Found ${filteredTools.length} AI tool${filteredTools.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>

          {/* AI Tools Grid - Portrait Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <Card
                key={tool.id}
                className="group relative bg-gray-800/40 border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-2 backdrop-blur-sm h-80"
              >
                {/* Edit Button - Only show for logged in users */}
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTool(tool);
                    }}
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800/80 hover:bg-gray-700/80 text-cyan-400 hover:text-cyan-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}

                <CardHeader className="pb-3 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    {tool.imageUrl ? (
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg">
                        <img 
                          src={tool.imageUrl} 
                          alt={tool.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to category icon if image fails to load
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div 
                          className={`hidden w-16 h-16 items-center justify-center rounded-xl bg-gradient-to-r ${getCategoryColor(tool.category)} shadow-lg`}
                        >
                          {getCategoryIcon(tool.category)}
                        </div>
                      </div>
                    ) : (
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${getCategoryColor(tool.category)} shadow-lg`}>
                        {getCategoryIcon(tool.category)}
                      </div>
                    )}
                    <div className="w-full">
                      <CardTitle className="text-lg text-gray-100 group-hover:text-cyan-400 transition-colors text-center">
                        {tool.name}
                      </CardTitle>
                      <div className="flex items-center justify-center space-x-2 mt-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(tool.rating) ? 'fill-current' : ''}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">({tool.rating})</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {tool.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-gray-700/50 text-gray-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {tool.tags.length > 2 && (
                      <Badge variant="secondary" className="bg-gray-700/50 text-gray-400 text-xs">
                        +{tool.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={tool.pricing === 'free' ? 'default' : 'outline'}
                        className={`text-xs ${
                          tool.pricing === 'free' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'border-gray-600 text-gray-300'
                        }`}
                      >
                        {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-400">{tool.releaseYear}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400">
                            <Info className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-700 border-gray-600 text-gray-100 max-w-xs">
                          <p className="text-sm">{tool.description}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {user && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(tool.id);
                          }}
                          className="text-gray-400 hover:text-pink-400"
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(tool.id) ? 'fill-current text-pink-400' : ''}`} />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                    onClick={() => window.open(tool.website, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <Brain className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl text-gray-400 mb-2">
                {showFavoritesOnly ? "No favorite tools found" : "No AI tools found"}
              </h3>
              <p className="text-gray-500">
                {showFavoritesOnly 
                  ? "Add some tools to your favorites to see them here" 
                  : "Try adjusting your filters or search terms"
                }
              </p>
            </div>
          )}
        </div>

        {/* Authentication Modal */}
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
        />

        {/* Edit Tool Modal */}
        {editingTool && (
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="bg-gray-800 border-gray-700 text-gray-100 max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit AI Tool</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Update the details of this AI tool
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingTool.name}
                    onChange={(e) => setEditingTool({...editingTool, name: e.target.value})}
                    className="bg-gray-700/50 border-gray-600"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-website">Website URL</Label>
                  <Input
                    id="edit-website"
                    value={editingTool.website}
                    onChange={(e) => setEditingTool({...editingTool, website: e.target.value})}
                    className="bg-gray-700/50 border-gray-600"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label htmlFor="edit-imageUrl">Custom Image URL (Optional)</Label>
                  <Input
                    id="edit-imageUrl"
                    value={editingTool.imageUrl || ''}
                    onChange={(e) => setEditingTool({...editingTool, imageUrl: e.target.value})}
                    className="bg-gray-700/50 border-gray-600"
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-xs text-gray-400 mt-1">Leave blank to use default category icon</p>
                </div>

                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={editingTool.category} onValueChange={(value) => setEditingTool({...editingTool, category: value})}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {categories.slice(1).map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-pricing">Pricing</Label>
                  <Select value={editingTool.pricing} onValueChange={(value) => setEditingTool({...editingTool, pricing: value})}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="freemium">Freemium</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-rating">Rating (1-5)</Label>
                  <Input
                    id="edit-rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={editingTool.rating}
                    onChange={(e) => setEditingTool({...editingTool, rating: parseFloat(e.target.value)})}
                    className="bg-gray-700/50 border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                  <Input
                    id="edit-tags"
                    value={editingTool.tags}
                    onChange={(e) => setEditingTool({...editingTool, tags: e.target.value})}
                    className="bg-gray-700/50 border-gray-600"
                    placeholder="AI, Writing, Productivity"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingTool.description}
                    onChange={(e) => setEditingTool({...editingTool, description: e.target.value})}
                    className="bg-gray-700/50 border-gray-600"
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdateTool}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                  disabled={!editingTool.name || !editingTool.website}
                >
                  Update Tool
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </TooltipProvider>
  );
};

export default AIDirectory;