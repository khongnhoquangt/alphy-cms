import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { isAuthenticated, clearAuth } from "@/lib/auth";
import { Search, Plus, LogOut, Upload, User } from "lucide-react";
import { useGetSummary } from "@/query/useGetSummary.ts";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: DashboardPage,
});

interface Wallet {
  id: number;
  profilePic: string | null;
  name: string;
  walletAddress: string;
  type: "KOL" | "Whale" | "Good trader" | "Insider" | "Excellent trader";
  description: string;
  xAccount: string;
}

const initialWallets: Wallet[] = [
  {
    id: 1,
    profilePic: null,
    name: "James wynn",
    walletAddress: "0x570b09e27a8",
    type: "Whale",
    description:
      "A big whales with lots of lose and many win, always big volume",
    xAccount: "",
  },
  {
    id: 2,
    profilePic: null,
    name: "Crazy whale",
    walletAddress: "0xd7a678fcf72c",
    type: "Insider",
    description: "",
    xAccount: "",
  },
  {
    id: 3,
    profilePic: null,
    name: "",
    walletAddress: "",
    type: "KOL",
    description: "",
    xAccount: "",
  },
  {
    id: 4,
    profilePic: null,
    name: "",
    walletAddress: "",
    type: "Excellent trader",
    description: "",
    xAccount: "",
  },
];

function DashboardPage() {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<Wallet[]>(initialWallets);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const { data } = useGetSummary();

  console.log({ data });

  // Form state
  const [formData, setFormData] = useState({
    walletAddress: "",
    type: "" as Wallet["type"] | "",
    profilePic: null as string | null,
    description: "",
    xAccount: "",
    name: "",
  });

  const handleLogout = () => {
    clearAuth();
    navigate({ to: "/login" });
  };

  const openNewWalletDialog = () => {
    setEditingWallet(null);
    setFormData({
      walletAddress: "",
      type: "",
      profilePic: null,
      description: "",
      xAccount: "",
      name: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setFormData({
      walletAddress: wallet.walletAddress,
      type: wallet.type,
      profilePic: wallet.profilePic,
      description: wallet.description,
      xAccount: wallet.xAccount,
      name: wallet.name,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.walletAddress || !formData.type) {
      return;
    }

    if (editingWallet) {
      // Update existing wallet
      setWallets(
        wallets.map((w) =>
          w.id === editingWallet.id
            ? { ...w, ...formData, type: formData.type as Wallet["type"] }
            : w,
        ),
      );
    } else {
      // Add new wallet
      const newWallet: Wallet = {
        id: Math.max(...wallets.map((w) => w.id), 0) + 1,
        profilePic: formData.profilePic,
        name: formData.name,
        walletAddress: formData.walletAddress,
        type: formData.type as Wallet["type"],
        description: formData.description,
        xAccount: formData.xAccount,
      };
      setWallets([...wallets, newWallet]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setWallets(wallets.filter((w) => w.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredWallets = wallets.filter(
    (wallet) =>
      wallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wallet.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wallet.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Calculate stats
  const totalTrackingWallet = wallets.length;
  const totalBalance = "800M";
  const total24hVolume = "80M";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Wallet Tracker</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Total tracking wallet
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {totalTrackingWallet}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Total balance
              </p>
              <p className="text-3xl font-bold text-blue-600">{totalBalance}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Total 24h Volume
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {total24hVolume}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search wallet"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={openNewWalletDialog}>
            <Plus className="h-4 w-4 mr-2" />
            New wallet
          </Button>
        </div>

        {/* Wallets Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Profile pic</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Wallet address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>X account</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWallets.map((wallet, index) => (
                <TableRow key={wallet.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {wallet.profilePic ? (
                      <img
                        src={wallet.profilePic}
                        alt={wallet.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {wallet.name || "-"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {wallet.walletAddress || "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        wallet.type === "Whale"
                          ? "bg-blue-100 text-blue-700"
                          : wallet.type === "KOL"
                            ? "bg-purple-100 text-purple-700"
                            : wallet.type === "Insider"
                              ? "bg-red-100 text-red-700"
                              : wallet.type === "Good trader"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {wallet.type}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {wallet.description || "-"}
                  </TableCell>
                  <TableCell>{wallet.xAccount || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(wallet)}
                      >
                        Edit
                      </Button>
                      <span className="text-muted-foreground">/</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(wallet.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {/* Empty rows to match the design */}
              {Array.from({
                length: Math.max(0, 7 - filteredWallets.length),
              }).map((_, i) => (
                <TableRow key={`empty-${i}`}>
                  <TableCell>{filteredWallets.length + i + 1}</TableCell>
                  <TableCell>
                    <div className="w-8 h-8 rounded-full bg-gray-100" />
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">Edit / Delete</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>

      {/* Add/Edit Wallet Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingWallet ? "Edit wallet" : "Add new wallet to tracking"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="walletAddress" className="text-right">
                Wallet address
              </Label>
              <Input
                id="walletAddress"
                value={formData.walletAddress}
                onChange={(e) =>
                  setFormData({ ...formData, walletAddress: e.target.value })
                }
                className="col-span-3"
                placeholder="0x..."
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
                placeholder="Wallet name"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as Wallet["type"] })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select: KOL, Whale, Good trader, Insider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KOL">KOL</SelectItem>
                  <SelectItem value="Whale">Whale</SelectItem>
                  <SelectItem value="Good trader">Good trader</SelectItem>
                  <SelectItem value="Insider">Insider</SelectItem>
                  <SelectItem value="Excellent trader">
                    Excellent trader
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profilePic" className="text-right">
                Profile pic
              </Label>
              <div className="col-span-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </div>
                  <input
                    type="file"
                    id="profilePic"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {formData.profilePic && (
                    <img
                      src={formData.profilePic}
                      alt="Preview"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="col-span-3"
                placeholder="write here"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="xAccount" className="text-right">
                X
              </Label>
              <Input
                id="xAccount"
                value={formData.xAccount}
                onChange={(e) =>
                  setFormData({ ...formData, xAccount: e.target.value })
                }
                className="col-span-3"
                placeholder="url"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
