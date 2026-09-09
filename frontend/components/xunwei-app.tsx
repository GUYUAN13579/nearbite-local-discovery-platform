/* oxlint-disable next/no-img-element */
'use client';

import { useEffect, useMemo, useState, type SyntheticEvent } from 'react';
import {
  Bell,
  CalendarCheck,
  ChevronDown,
  Compass,
  Flame,
  Heart,
  ImagePlus,
  MapPin,
  MessageCircle,
  Navigation,
  PenLine,
  Search,
  Send,
  Sparkles,
  Star,
  TicketPercent,
  UserPlus,
  UserRound,
} from 'lucide-react';
import { apiRequest, normalizeAsset } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toaster, toast } from '@/components/ui/toast';

type View = 'home' | 'notes' | 'favorites' | 'profile';
type Shop = {
  id: number;
  name: string;
  typeId?: number;
  category: string;
  area: string;
  rating: number;
  comments: number;
  price: number;
  image: string;
  tag: string;
  address?: string;
};
type Category = { id: number; name: string; icon: string };
type Note = {
  id: number;
  title: string;
  content: string;
  image: string;
  author: string;
  avatar: string;
  liked: number;
};
type Voucher = {
  id: number;
  title: string;
  subTitle?: string;
  payValue: number;
  actualValue: number;
  stock?: number;
};
type BackendCategory = { id: number; name: string; icon: string };
type BackendShop = {
  id: number;
  name: string;
  typeId?: number;
  area?: string;
  score?: number;
  comments?: number;
  avgPrice?: number;
  images?: string;
  address?: string;
};
type BackendNote = {
  id: number;
  title: string;
  content?: string;
  images?: string;
  name?: string;
  icon?: string;
  liked?: number;
};
type BackendUser = { nickName: string; icon?: string };

const demoCategories: Category[] = [
  { id: 1, name: '美食', icon: '/imgs/types/ms.png' },
  { id: 2, name: 'KTV', icon: '/imgs/types/KTV.png' },
  { id: 3, name: '丽人美发', icon: '/imgs/types/lrmf.png' },
  { id: 4, name: '健身运动', icon: '/imgs/types/jsyd.png' },
  { id: 5, name: '按摩足疗', icon: '/imgs/types/amzl.png' },
  { id: 6, name: 'SPA', icon: '/imgs/types/spa.png' },
  { id: 7, name: '亲子玩乐', icon: '/imgs/types/qzyl.png' },
  { id: 8, name: '酒吧', icon: '/imgs/types/jiuba.png' },
];

const demoShops: Shop[] = [
  {
    id: 1,
    name: '小筑里花园餐厅',
    category: '创意菜',
    area: '静安寺',
    rating: 4.8,
    comments: 1268,
    price: 128,
    image: '/imgs/blogs/4/10/2f07e3c9-ddce-482d-9ea7-c21450f8d7cd.jpg',
    tag: '本周口碑榜 TOP 1',
    address: '南京西路 1266 号',
  },
  {
    id: 2,
    name: '港味集合社',
    category: '港式茶餐厅',
    area: '人民广场',
    rating: 4.7,
    comments: 986,
    price: 76,
    image: '/imgs/blogs/4/7/863cc302-d150-420d-a596-b16e9232a1a6.jpg',
    tag: '回头客很多',
    address: '西藏中路 268 号',
  },
  {
    id: 3,
    name: '铜锣湾烧味',
    category: '粤菜',
    area: '徐家汇',
    rating: 4.6,
    comments: 742,
    price: 89,
    image: '/imgs/blogs/9/12/ac2ce2fb-0605-4f14-82cc-c962b8c86688.jpg',
    tag: '招牌双拼必点',
    address: '肇嘉浜路 1111 号',
  },
  {
    id: 4,
    name: '原野马术俱乐部',
    category: '户外运动',
    area: '青浦新城',
    rating: 4.9,
    comments: 436,
    price: 198,
    image: '/imgs/blogs/blog1.jpg',
    tag: '周末遛娃新去处',
    address: '淀山湖大道 3999 号',
  },
];

const demoNotes: Note[] = [
  {
    id: 1,
    title: '藏在梧桐区里的花园餐厅',
    content: '晚风、烛光和刚出炉的面包，约会氛围感直接拉满。',
    image: '/imgs/blogs/4/10/2f07e3c9-ddce-482d-9ea7-c21450f8d7cd.jpg',
    author: '阿圆吃不胖',
    avatar: '/imgs/icons/icon1.jpg',
    liked: 892,
  },
  {
    id: 2,
    title: '这一桌港味让我瞬间回到旺角',
    content: '烧味油润但不腻，菠萝包一定要趁热吃。',
    image: '/imgs/blogs/9/12/ac2ce2fb-0605-4f14-82cc-c962b8c86688.jpg',
    author: '城市胃游记',
    avatar: '/imgs/icons/kkjtbcr.jpg',
    liked: 651,
  },
  {
    id: 3,
    title: '周末别宅了，去郊外骑马',
    content: '新手也能轻松上手，草地拍照特别出片。',
    image: '/imgs/blogs/blog1.jpg',
    author: '小鹿去哪里',
    avatar: '/imgs/icons/user5-icon.png',
    liked: 418,
  },
  {
    id: 4,
    title: '四个人点这一桌刚刚好',
    content: '人均不过百，招牌菜几乎没有踩雷。',
    image: '/imgs/blogs/7/14/4771fefb-1a87-4252-816c-9f7ec41ffa4a.jpg',
    author: '饭搭子研究所',
    avatar: '/imgs/icons/default-icon.png',
    liked: 1024,
  },
  {
    id: 5,
    title: '热闹又松弛的夜宵据点',
    content: '下班后的快乐，是朋友和一桌热腾腾的菜。',
    image: '/imgs/blogs/4/7/863cc302-d150-420d-a596-b16e9232a1a6.jpg',
    author: '吃饭先拍照',
    avatar: '/imgs/icons/icon1.jpg',
    liked: 733,
  },
];

const demoVouchers: Voucher[] = [
  {
    id: 1,
    title: '100元代金券',
    subTitle: '周一至周五可用',
    payValue: 7000,
    actualValue: 10000,
    stock: 37,
  },
  {
    id: 2,
    title: '招牌双人餐',
    subTitle: '含招牌菜与饮品',
    payValue: 16800,
    actualValue: 23800,
    stock: 16,
  },
];

function firstImage(value?: string) {
  return normalizeAsset(value?.split(',')[0]);
}

export function XunweiApp() {
  const [view, setView] = useState<View>('home');
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState(demoCategories);
  const [activeCategory, setActiveCategory] = useState(1);
  const [shops, setShops] = useState(demoShops);
  const [notes, setNotes] = useState(demoNotes);
  const [favorites, setFavorites] = useState<number[]>([2]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>(demoVouchers);
  const [loginOpen, setLoginOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [user, setUser] = useState<{ nickName: string; icon?: string } | null>(
    null,
  );
  const [liveData, setLiveData] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    async function hydrate() {
      try {
        const [types, remoteShops, remoteNotes] = await Promise.all([
          apiRequest<BackendCategory[]>('/shop-type/list'),
          apiRequest<BackendShop[]>('/shop/of/type?typeId=1&current=1'),
          apiRequest<BackendNote[]>('/blog/hot?current=1'),
        ]);
        if (types?.length)
          setCategories(
            types.map((item) => ({
              id: item.id,
              name: item.name,
              icon: normalizeAsset(item.icon),
            })),
          );
        if (remoteShops?.length)
          setShops(
            remoteShops.map((item) => ({
              id: item.id,
              name: item.name,
              typeId: item.typeId,
              category: '本地好店',
              area: item.area || '附近',
              rating: Number(item.score || 45) / 10,
              comments: item.comments || 268,
              price: item.avgPrice || 88,
              image: firstImage(item.images),
              tag: '附近人气推荐',
              address: item.address,
            })),
          );
        if (remoteNotes?.length)
          setNotes(
            remoteNotes.map((item) => ({
              id: item.id,
              title: item.title,
              content: item.content || '',
              image: firstImage(item.images),
              author: item.name || '城市发现家',
              avatar: normalizeAsset(item.icon || '/imgs/icons/icon1.jpg'),
              liked: item.liked || 0,
            })),
          );
        setLiveData(true);
        try {
          const me = await apiRequest<BackendUser>('/user/me');
          if (me) setUser({ nickName: me.nickName, icon: me.icon });
        } catch {}
      } catch {
        setLiveData(false);
      }
    }
    void hydrate();
  }, []);

  const filteredShops = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const source =
      view === 'favorites'
        ? shops.filter((shop) => favorites.includes(shop.id))
        : shops;
    return keyword
      ? source.filter((shop) =>
          [shop.name, shop.category, shop.area].some((value) =>
            value.toLowerCase().includes(keyword),
          ),
        )
      : source;
  }, [favorites, query, shops, view]);

  async function chooseCategory(id: number) {
    setActiveCategory(id);
    setView('home');
    if (!liveData) return;
    try {
      const remote = await apiRequest<BackendShop[]>(
        `/shop/of/type?typeId=${id}&current=1`,
      );
      setShops(
        remote.map((item) => ({
          id: item.id,
          name: item.name,
          typeId: item.typeId,
          category: categories.find((c) => c.id === id)?.name || '本地好店',
          area: item.area || '附近',
          rating: Number(item.score || 45) / 10,
          comments: item.comments || 268,
          price: item.avgPrice || 88,
          image: firstImage(item.images),
          tag: '附近人气推荐',
          address: item.address,
        })),
      );
    } catch {
      toast.add({
        title: '暂时无法刷新',
        description: '已为你保留当前推荐',
        type: 'info',
      });
    }
  }

  async function openShop(shop: Shop) {
    setSelectedShop(shop);
    if (!liveData) return setVouchers(demoVouchers);
    try {
      const remote = await apiRequest<Voucher[]>(`/voucher/list/${shop.id}`);
      setVouchers(remote?.length ? remote : demoVouchers);
    } catch {
      setVouchers(demoVouchers);
    }
  }

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    toast.add({
      title: favorites.includes(id) ? '已取消收藏' : '已加入收藏',
      type: 'success',
    });
  }

  async function sendCode() {
    if (!/^1\d{10}$/.test(phone))
      return toast.add({ title: '请输入正确的手机号', type: 'warning' });
    try {
      await apiRequest('/user/code?phone=' + phone, { method: 'POST' });
      toast.add({
        title: '验证码已发送',
        description: '请查看后端控制台或短信服务',
        type: 'success',
      });
    } catch {
      toast.add({
        title: '演示验证码已发送',
        description: '演示模式下输入任意 6 位数字即可',
        type: 'info',
      });
    }
  }

  async function login() {
    if (!/^1\d{10}$/.test(phone) || !/^\d{6}$/.test(code))
      return toast.add({ title: '请填写手机号和 6 位验证码', type: 'warning' });
    try {
      const token = await apiRequest<string>('/user/login', {
        method: 'POST',
        body: JSON.stringify({ phone, code }),
      });
      sessionStorage.setItem('xunwei-token', token);
      const me = await apiRequest<BackendUser>('/user/me');
      setUser({ nickName: me.nickName, icon: me.icon });
    } catch {
      setUser({ nickName: '城市漫游者', icon: '/imgs/icons/icon1.jpg' });
    }
    setLoginOpen(false);
    toast.add({
      title: '登录成功',
      description: '欢迎回来，继续发现城市惊喜',
      type: 'success',
    });
  }

  async function signIn() {
    if (!user) return setLoginOpen(true);
    try {
      if (liveData) await apiRequest('/user/sign', { method: 'POST' });
    } catch {}
    setSigned(true);
    toast.add({ title: '签到成功', description: '探索值 +5', type: 'success' });
  }

  async function seckill(voucherId: number) {
    if (!user) {
      setSelectedShop(null);
      return setLoginOpen(true);
    }
    try {
      if (liveData)
        await apiRequest(`/voucher-order/seckill/${voucherId}`, {
          method: 'POST',
        });
    } catch {}
    toast.add({
      title: '抢购成功',
      description: liveData
        ? '订单已创建，请尽快支付'
        : '演示订单已加入「我的」',
      type: 'success',
    });
  }

  async function publishNote(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const titleValue = data.get('title');
    const contentValue = data.get('content');
    const title = typeof titleValue === 'string' ? titleValue : '';
    const content = typeof contentValue === 'string' ? contentValue : '';
    if (!title || !content) return;
    try {
      if (liveData)
        await apiRequest('/blog', {
          method: 'POST',
          body: JSON.stringify({
            title,
            content,
            images: demoNotes[0].image,
            shopId: 1,
          }),
        });
    } catch {}
    setNotes((current) => [
      {
        ...demoNotes[0],
        id: Date.now(),
        title,
        content,
        author: user?.nickName || '城市漫游者',
      },
      ...current,
    ]);
    setPublishOpen(false);
    setView('notes');
    toast.add({
      title: '笔记发布成功',
      description: '你的城市灵感已经上线',
      type: 'success',
    });
  }

  const navItems: { id: View; label: string; icon: typeof Compass }[] = [
    { id: 'home', label: '发现', icon: Compass },
    { id: 'notes', label: '探店笔记', icon: Flame },
    { id: 'favorites', label: '收藏', icon: Heart },
    { id: 'profile', label: '我的', icon: UserRound },
  ];

  return (
    <Toaster>
      <main className="min-h-screen bg-[#f7f7f8] pb-20 text-slate-900 md:pb-10">
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:h-[72px] md:px-8">
            <button
              onClick={() => setView('home')}
              className="flex shrink-0 items-center gap-2.5"
              aria-label="寻味生活首页"
            >
              <span className="grid size-10 rotate-[-7deg] place-items-center rounded-[14px] bg-orange-500 text-white shadow-[0_8px_18px_rgba(249,115,22,.24)]">
                <MapPin className="size-5" strokeWidth={2.5} />
              </span>
              <span className="hidden text-xl font-black tracking-[-0.04em] sm:block">
                寻味生活
              </span>
            </button>
            <button className="hidden items-center gap-1 text-sm font-semibold text-slate-700 md:flex">
              上海 <ChevronDown className="size-4 text-slate-400" />
            </button>
            <form
              className="relative mx-auto w-full max-w-[500px]"
              onSubmit={(event) => event.preventDefault()}
            >
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                aria-label="搜索门店、商圈或菜系"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜门店、商圈或想吃的"
                className="h-11 rounded-full border-slate-200 bg-slate-100/80 pl-11 pr-20 text-[15px] shadow-none focus-visible:bg-white"
              />
              <Button
                type="submit"
                className="absolute right-1 top-1 h-9 rounded-full px-5 font-semibold"
              >
                搜索
              </Button>
            </form>
            <nav
              className="hidden shrink-0 items-center gap-1 lg:flex"
              aria-label="主导航"
            >
              {navItems.slice(0, 2).map((item) => (
                <Button
                  key={item.id}
                  variant={view === item.id ? 'secondary' : 'ghost'}
                  onClick={() => setView(item.id)}
                >
                  {item.label}
                </Button>
              ))}
              <Button variant="ghost" size="icon" aria-label="消息">
                <Bell className="size-5" />
              </Button>
              <Button
                variant="ghost"
                className="gap-2"
                onClick={() => (user ? setView('profile') : setLoginOpen(true))}
              >
                <UserRound className="size-4" />
                {user?.nickName || '登录'}
              </Button>
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8 md:pt-8">
          <div className="mb-5 flex items-center justify-between">
            <Badge
              variant="outline"
              className="rounded-full bg-white text-slate-500"
            >
              <span
                className={`mr-2 size-2 rounded-full ${liveData ? 'bg-emerald-500' : 'bg-orange-400'}`}
              />
              {liveData ? '后端实时数据' : '离线演示数据'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-white"
              onClick={() => (user ? setPublishOpen(true) : setLoginOpen(true))}
            >
              <PenLine className="size-4" />
              发布探店
            </Button>
          </div>

          {view === 'home' && (
            <>
              <section className="overflow-hidden rounded-[28px] bg-[#192230] text-white shadow-[0_18px_50px_rgba(15,23,42,.12)]">
                <div className="grid min-h-[224px] md:grid-cols-[1.14fr_.86fr]">
                  <div className="relative z-10 flex flex-col justify-center px-6 py-8 md:px-10 md:py-10">
                    <Badge className="mb-4 w-fit border-orange-300/30 bg-orange-400/15 text-orange-200 hover:bg-orange-400/15">
                      <Sparkles className="mr-1.5 size-3.5" />
                      城市味觉指南
                    </Badge>
                    <h1 className="max-w-xl text-3xl font-black leading-tight tracking-[-0.04em] md:text-[42px]">
                      今天，去发现一家
                      <br />
                      <span className="text-orange-400">值得专程去的店</span>
                    </h1>
                    <p className="mt-4 max-w-lg text-[15px] leading-7 text-slate-300 md:text-base">
                      从真实口碑到限时优惠，把城市里有趣、好吃、好玩的生活灵感装进口袋。
                    </p>
                  </div>
                  <div className="relative min-h-[190px] overflow-hidden md:min-h-0">
                    <img
                      src="/imgs/blogs/7/14/4771fefb-1a87-4252-816c-9f7ec41ffa4a.jpg"
                      alt="一桌丰盛的餐食"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#192230] via-[#192230]/20 to-transparent" />
                    <div className="absolute bottom-5 right-5 rounded-2xl bg-white/92 px-4 py-3 text-slate-900 shadow-xl backdrop-blur">
                      <p className="text-xs font-medium text-slate-500">
                        今日精选
                      </p>
                      <p className="mt-0.5 font-bold">城市烟火气 · 6家</p>
                    </div>
                  </div>
                </div>
              </section>
              <section
                aria-labelledby="category-title"
                className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-5 md:px-7"
              >
                <div className="flex items-center justify-between">
                  <h2
                    id="category-title"
                    className="text-lg font-black tracking-tight"
                  >
                    探索分类
                  </h2>
                  <button className="text-sm font-semibold text-orange-600">
                    全部分类
                  </button>
                </div>
                <div className="mt-5 grid grid-cols-4 gap-4 sm:grid-cols-8">
                  {categories.slice(0, 8).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => chooseCategory(category.id)}
                      className="group flex flex-col items-center gap-2"
                      aria-pressed={activeCategory === category.id}
                    >
                      <span
                        className={`grid size-14 place-items-center rounded-2xl transition ${activeCategory === category.id ? 'bg-orange-100 ring-2 ring-orange-400 ring-offset-2' : 'bg-slate-50 group-hover:bg-orange-50'}`}
                      >
                        <img
                          src={category.icon}
                          alt=""
                          className="size-9 object-contain"
                        />
                      </span>
                      <span
                        className={`text-sm font-semibold ${activeCategory === category.id ? 'text-orange-600' : 'text-slate-600'}`}
                      >
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {(view === 'home' || view === 'favorites') && (
            <ShopGrid
              title={view === 'favorites' ? '我的收藏' : '附近人气好店'}
              shops={filteredShops}
              favorites={favorites}
              onOpen={openShop}
              onFavorite={toggleFavorite}
              showAside={view === 'home'}
              onSign={signIn}
              signed={signed}
            />
          )}

          {view === 'notes' && (
            <NotesView
              notes={notes}
              onLike={(id) =>
                setNotes((current) =>
                  current.map((note) =>
                    note.id === id ? { ...note, liked: note.liked + 1 } : note,
                  ),
                )
              }
              onPublish={() =>
                user ? setPublishOpen(true) : setLoginOpen(true)
              }
            />
          )}

          {view === 'profile' && (
            <ProfileView
              user={user}
              favorites={favorites.length}
              signed={signed}
              onLogin={() => setLoginOpen(true)}
              onSign={signIn}
              onFavorites={() => setView('favorites')}
            />
          )}
        </div>

        <nav
          className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-4 backdrop-blur md:hidden"
          aria-label="移动导航"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() =>
                  item.id === 'profile' && !user
                    ? setLoginOpen(true)
                    : setView(item.id)
                }
                className={`flex flex-col items-center gap-1 text-xs font-semibold ${view === item.id ? 'text-orange-600' : 'text-slate-400'}`}
              >
                <Icon className="size-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <Dialog
          open={!!selectedShop}
          onOpenChange={(open) => !open && setSelectedShop(null)}
        >
          <DialogContent className="max-h-[88vh] overflow-y-auto p-0 sm:max-w-2xl">
            {selectedShop && (
              <>
                <div className="relative aspect-[16/7] overflow-hidden rounded-t-xl">
                  <img
                    src={selectedShop.image}
                    alt={selectedShop.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                  <div className="absolute bottom-5 left-5 text-white">
                    <Badge className="mb-2 bg-orange-500">
                      {selectedShop.tag}
                    </Badge>
                    <DialogTitle className="text-2xl font-black">
                      {selectedShop.name}
                    </DialogTitle>
                  </div>
                </div>
                <div className="space-y-5 p-5">
                  <DialogDescription className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 font-bold text-orange-600">
                      <Star className="size-4 fill-orange-500" />
                      {selectedShop.rating}
                    </span>
                    <span>{selectedShop.comments} 条真实评价</span>
                    <span>¥{selectedShop.price}/人</span>
                  </DialogDescription>
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="size-4 text-orange-500" />
                    {selectedShop.address || selectedShop.area}
                  </p>
                  <div>
                    <h3 className="font-black">优惠团购</h3>
                    <div className="mt-3 space-y-3">
                      {vouchers.map((voucher) => (
                        <div
                          key={voucher.id}
                          className="flex items-center gap-4 rounded-xl border border-orange-100 bg-orange-50/60 p-4"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-bold">{voucher.title}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {voucher.subTitle || '到店出示券码核销'} · 剩余{' '}
                              {voucher.stock ?? 20} 份
                            </p>
                            <p className="mt-2">
                              <span className="text-xl font-black text-orange-600">
                                ¥{voucher.payValue / 100}
                              </span>
                              <span className="ml-2 text-xs text-slate-400 line-through">
                                ¥{voucher.actualValue / 100}
                              </span>
                            </p>
                          </div>
                          <Button
                            onClick={() => seckill(voucher.id)}
                            className="rounded-full"
                          >
                            立即抢购
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">
                登录寻味生活
              </DialogTitle>
              <DialogDescription>
                未连接后端时会自动进入演示模式，便于独立展示。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3">
              <Input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="手机号"
                maxLength={11}
                className="h-11"
              />
              <div className="flex gap-2">
                <Input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="6 位验证码"
                  maxLength={6}
                  className="h-11"
                />
                <Button variant="outline" onClick={sendCode}>
                  获取验证码
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={login}>
                登录 / 注册
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={publishNote}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">
                  发布探店笔记
                </DialogTitle>
                <DialogDescription>
                  分享你发现的好味道和城市新去处。
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-5">
                <Input
                  name="title"
                  placeholder="给笔记起个吸引人的标题"
                  required
                />
                <Textarea
                  name="content"
                  placeholder="环境、口味、服务……说说真实感受"
                  rows={6}
                  required
                />
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-5 text-sm font-semibold text-slate-500 hover:border-orange-300 hover:bg-orange-50"
                >
                  <ImagePlus className="size-5" />
                  添加照片（演示）
                </button>
              </div>
              <DialogFooter>
                <Button type="submit" className="gap-2">
                  <Send className="size-4" />
                  发布笔记
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </Toaster>
  );
}

function ShopGrid({
  title,
  shops,
  favorites,
  onOpen,
  onFavorite,
  showAside,
  onSign,
  signed,
}: {
  title: string;
  shops: Shop[];
  favorites: number[];
  onOpen: (shop: Shop) => void;
  onFavorite: (id: number) => void;
  showAside: boolean;
  onSign: () => void;
  signed: boolean;
}) {
  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-orange-600">
              {showAside ? 'NEARBY PICKS' : 'SAVED PLACES'}
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.03em]">
              {title}
            </h2>
          </div>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
            <Navigation className="size-4" />
            智能排序
          </span>
        </div>
        {shops.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {shops.map((shop) => (
              <article
                key={shop.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(15,23,42,.09)]"
              >
                <button
                  aria-label={`查看${shop.name}详情`}
                  onClick={() => onOpen(shop)}
                  className="absolute inset-0 z-10 cursor-pointer"
                />
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onFavorite(shop.id);
                    }}
                    aria-label={`收藏${shop.name}`}
                    className={`absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur ${favorites.includes(shop.id) ? 'text-orange-600' : 'text-slate-700'}`}
                  >
                    <Heart
                      className={`size-[18px] ${favorites.includes(shop.id) ? 'fill-orange-500' : ''}`}
                    />
                  </button>
                  <span className="absolute bottom-3 left-3 rounded-lg bg-slate-950/78 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    {shop.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-black tracking-tight">
                    {shop.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-1.5 text-sm">
                    <span className="flex items-center gap-0.5 font-bold text-orange-600">
                      <Star className="size-4 fill-orange-500 text-orange-500" />
                      {shop.rating}
                    </span>
                    <span className="text-slate-400">
                      {shop.comments}条评价
                    </span>
                    <span className="ml-auto text-slate-600">
                      ¥{shop.price}/人
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-sm text-slate-500">
                    <span>
                      {shop.category} · {shop.area}
                    </span>
                    <span className="font-semibold text-orange-600">
                      到店团购
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
            <div>
              <Heart className="mx-auto size-8 text-slate-300" />
              <p className="mt-3 font-bold">这里还空空的</p>
              <p className="mt-1 text-sm text-slate-500">
                遇见喜欢的店就收藏起来吧
              </p>
            </div>
          </div>
        )}
      </div>
      {showAside && (
        <aside className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 p-5 text-white shadow-[0_16px_35px_rgba(249,115,22,.18)]">
            <TicketPercent className="size-7" />
            <p className="mt-5 text-sm font-semibold text-orange-100">
              新客专享
            </p>
            <h2 className="mt-1 text-2xl font-black">满 100 减 30</h2>
            <p className="mt-2 text-sm text-orange-100">
              全城 1,200+ 家门店可用
            </p>
            <Button
              variant="secondary"
              className="mt-5 w-full font-bold text-orange-600"
            >
              立即领取
            </Button>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <CalendarCheck className="size-6 text-orange-500" />
            <p className="mt-4 font-black">每日签到</p>
            <p className="mt-1 text-sm text-slate-500">
              连续探索，解锁城市徽章
            </p>
            <Button
              variant="outline"
              onClick={onSign}
              disabled={signed}
              className="mt-4 w-full"
            >
              {signed ? '今日已签到' : '签到 +5 探索值'}
            </Button>
          </div>
        </aside>
      )}
    </section>
  );
}

function NotesView({
  notes,
  onLike,
  onPublish,
}: {
  notes: Note[];
  onLike: (id: number) => void;
  onPublish: () => void;
}) {
  return (
    <section>
      <div className="rounded-[28px] bg-orange-500 px-6 py-8 text-white md:flex md:items-center md:justify-between md:px-10">
        <div>
          <Badge className="bg-white/20 hover:bg-white/20">灵感社区</Badge>
          <h1 className="mt-4 text-3xl font-black tracking-tight">
            跟着城市玩家去探店
          </h1>
          <p className="mt-2 text-orange-100">
            真实体验、宝藏路线和不踩雷攻略。
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={onPublish}
          className="mt-6 gap-2 font-bold text-orange-600 md:mt-0"
        >
          <PenLine className="size-4" />
          发布我的笔记
        </Button>
      </div>
      <div className="mt-6 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {notes.map((note) => (
          <article
            key={note.id}
            className="mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <img
              src={note.image}
              alt={note.title}
              className="max-h-[360px] w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-black leading-snug">{note.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {note.content}
              </p>
              <div className="mt-4 flex items-center">
                <img
                  src={note.avatar}
                  alt=""
                  className="size-8 rounded-full bg-slate-100 object-cover"
                />
                <span className="ml-2 text-sm font-semibold">
                  {note.author}
                </span>
                <button
                  onClick={() => onLike(note.id)}
                  className="ml-auto flex items-center gap-1 text-sm text-slate-500 hover:text-orange-600"
                >
                  <Heart className="size-4" />
                  {note.liked}
                </button>
                <MessageCircle className="ml-3 size-4 text-slate-400" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfileView({
  user,
  favorites,
  signed,
  onLogin,
  onSign,
  onFavorites,
}: {
  user: { nickName: string; icon?: string } | null;
  favorites: number;
  signed: boolean;
  onLogin: () => void;
  onSign: () => void;
  onFavorites: () => void;
}) {
  if (!user)
    return (
      <section className="grid min-h-[560px] place-items-center rounded-[28px] border border-slate-200 bg-white text-center">
        <div>
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-orange-100">
            <UserRound className="size-9 text-orange-500" />
          </div>
          <h1 className="mt-5 text-2xl font-black">登录后收藏城市好去处</h1>
          <p className="mt-2 text-slate-500">同步收藏、订单和探店笔记。</p>
          <Button onClick={onLogin} className="mt-6 px-8">
            立即登录
          </Button>
        </div>
      </section>
    );
  return (
    <section>
      <div className="overflow-hidden rounded-[28px] bg-[#192230] p-7 text-white md:p-10">
        <div className="flex flex-wrap items-center gap-5">
          <img
            src={normalizeAsset(user.icon || '/imgs/icons/icon1.jpg')}
            alt=""
            className="size-20 rounded-full border-4 border-white/15 bg-white object-cover"
          />
          <div>
            <p className="text-sm text-slate-300">欢迎回来</p>
            <h1 className="mt-1 text-3xl font-black">{user.nickName}</h1>
            <Badge className="mt-3 bg-orange-500">城市探索家 Lv.3</Badge>
          </div>
          <Button
            onClick={onSign}
            disabled={signed}
            variant="secondary"
            className="ml-auto gap-2"
          >
            <CalendarCheck className="size-4" />
            {signed ? '今日已签到' : '今日签到'}
          </Button>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <button
          onClick={onFavorites}
          className="rounded-2xl border border-slate-200 bg-white p-6 text-left"
        >
          <Heart className="size-6 text-orange-500" />
          <p className="mt-5 text-3xl font-black">{favorites}</p>
          <p className="mt-1 text-sm text-slate-500">收藏的好店</p>
        </button>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <TicketPercent className="size-6 text-orange-500" />
          <p className="mt-5 text-3xl font-black">2</p>
          <p className="mt-1 text-sm text-slate-500">待使用优惠券</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <UserPlus className="size-6 text-orange-500" />
          <p className="mt-5 text-3xl font-black">128</p>
          <p className="mt-1 text-sm text-slate-500">关注与粉丝</p>
        </div>
      </div>
    </section>
  );
}
