import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { isAuthenticated, clearAuth } from "@/lib/auth";
import { Search, Plus, LogOut } from "lucide-react";
import { useGetSummary } from "@/query/useGetSummary.ts";
import { useGetWalletTracking } from "@/query/useGetWalletTracking.ts";
import { nFormatter } from "@/lib/nFormatter.ts";
import { useDebounce } from "@/hooks/useDebounce";
import { WalletsTable, WalletDialog, type Wallet } from "@/components/wallets";

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

function DashboardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const { data } = useGetSummary();

  const dataSummary = useMemo(() => {
    return data?.data?.data || {};
  }, [data]);

  // Debounce search query by 300ms
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: dataTrading } = useGetWalletTracking({
    search: debouncedSearchQuery,
    page: currentPage - 1,
    limit: 10,
  });

  const listWallet = useMemo(() => {
    return dataTrading?.data?.data?.wallets || [];
  }, [dataTrading]);

  const totalPages = useMemo(() => {
    return dataTrading?.data?.data?.totalPages || 0;
  }, [dataTrading]);

  const handleLogout = () => {
    clearAuth();
    navigate({ to: "/login" });
  };

  const openNewWalletDialog = () => {
    setEditingWallet(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setIsDialogOpen(true);
  };

  // Reset to page 1 when search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
                {dataSummary?.totalTrackingWallets}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Total balance
              </p>
              <p className="text-3xl font-bold text-blue-600">
                ${nFormatter(dataSummary?.totalBalance)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Total 24h Volume
              </p>
              <p className="text-3xl font-bold text-blue-600">
                ${nFormatter(dataSummary?.total24hVolume)}
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
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <Button onClick={openNewWalletDialog}>
            <Plus className="h-4 w-4 mr-2" />
            New wallet
          </Button>
        </div>

        {/* Wallets Table with Pagination */}
        <WalletsTable
          wallets={listWallet}
          onEdit={openEditDialog}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={10}
        />
      </main>

      {/* Add/Edit Wallet Dialog */}
      <WalletDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingWallet={editingWallet}
      />
    </div>
  );
}
