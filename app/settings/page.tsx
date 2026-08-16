"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 💡 追加：ページ遷移用
import { auth, db } from "../src/firebaseConfig";
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  linkWithPopup,
  signOut,
  updatePassword,
  sendPasswordResetEmail,
  User
} from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { LogOut, Mail, Check, Plus, ShieldCheck, KeyRound } from "lucide-react";
import BottomNav from "../ui/BottomNav";

// 分割したコンポーネントをインポート
import AuthModal from "./components/AuthModal";
import ContactModal from "./components/ContactModal";
import GuideModal from "./components/GuideModal";
import TermsModal from "./components/TermsModal";

export default function SettingsPage() {
  const router = useRouter(); // 💡 宣言
  const [user, setUser] = useState<User | null>(null);
  const [activeModal, setActiveModal] = useState<"auth" | "guide" | "contact" | "terms" | "about" | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  // 認証フォーム入力値
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // パスワード変更・設定用入力値
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // お問い合わせフォーム入力値
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log("ログイン中のUID:", currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      if (authMode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("アカウントを作成しました！");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("ログインしました！");
      }
      setEmail("");
      setPassword("");
      setActiveModal(null);
    } catch (error: any) {
      console.error("認証エラー:", error);
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("このメールアドレスはすでに使われています。");
      } else if (error.code === "auth/invalid-credential") {
        setErrorMessage("メールアドレスまたはパスワードが間違っています。");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("パスワードは6文字以上で入力してください。");
      } else {
        setErrorMessage("認証に失敗しました。入力内容を確認してください。");
      }
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      if (!user) {
        const result = await signInWithPopup(auth, provider);
        alert(`${result.user.displayName || "ユーザー"} さん、ログインしました！`);
      } else {
        await linkWithPopup(user, provider);
        alert("Googleアカウントを連携しました！");
      }
      setActiveModal(null);
    } catch (error: any) {
      console.error("Google認証失敗:", error);
      alert(`Google連携に失敗しました: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    if (!confirm("ログアウトしますか？")) return;
    try {
      await signOut(auth);
      router.push("/"); // 💡 「はい」を選んだらログアウトしてトップ（ログイン画面）へ強制的に飛ぶ
    } catch (error) {
      console.error("ログアウト失敗:", error);
    }
  };

  // パスワード変更または新規設定の処理
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPassword) return;
    if (newPassword.length < 6) {
      alert("パスワードは6文字以上で入力してください。");
      return;
    }

    try {
      await updatePassword(user, newPassword);
      alert("パスワードを更新しました！");
      setNewPassword("");
      setIsChangingPassword(false);
    } catch (error: any) {
      console.error("パスワード更新エラー:", error);
      alert("パスワードの更新に失敗しました。一度ログアウトして再ログインしてからお試しください。");
    }
  };

  // パスワードを忘れた場合の再設定メール送信
  const handlePasswordResetEmail = async () => {
    if (!user?.email) return;
    if (!confirm(`${user.email} 宛にパスワード再設定用のメールを送信しますか？`)) return;

    try {
      await sendPasswordResetEmail(auth, user.email);
      alert("パスワード再設定メールを送信しました。メールをご確認ください！");
    } catch (error: any) {
      console.error("再設定メール送信エラー:", error);
      alert("メールの送信に失敗しました。");
    }
  };

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "contacts"), {
        email: contactEmail,
        message: contactMessage,
        createdAt: serverTimestamp(),
        uid: user ? user.uid : "guest"
      });

      setContactSuccess(true);
      setContactMessage("");
      setTimeout(() => {
        setContactSuccess(false);
        setActiveModal(null);
      }, 3000);
    } catch (error) {
      console.error("お問い合わせ送信エラー:", error);
      alert("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const linkedProviders = user?.providerData.map(p => p.providerId) || [];
  const hasGoogle = linkedProviders.includes("google.com");
  const hasPassword = linkedProviders.includes("password");

  return (
    <div className="min-h-screen bg-pink-50 p-6 pt-10 pb-32 text-gray-800">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">menu</h1>
        
        {/* アカウントセクション */}
        <div>
          <h2 className="text-pink-600 text-xs font-bold mb-3 uppercase tracking-wider px-1">
            アカウント・ログイン方法
          </h2>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-pink-100 p-5 space-y-4">
            {user ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-pink-50">
                  <div>
                    <p className="text-xs text-gray-400">ログイン中のアカウント</p>
                    <p className="text-sm font-bold text-gray-800">{user.displayName || user.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> ログアウト
                  </button>
                </div>

                <div className="space-y-2.5 pt-1">
                  <p className="text-xs font-bold text-gray-700">連携しているログイン方法</p>
                  
                  {/* メールアドレスの状態 */}
                  <div className="flex items-center justify-between p-3 bg-pink-50/50 rounded-2xl border border-pink-100">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-pink-600" /> メールアドレス・パスワード
                    </span>
                    {hasPassword ? (
                      <span className="text-xs font-bold text-pink-600 flex items-center gap-1 bg-white px-3 py-1 rounded-xl shadow-xs">
                        <Check className="w-3.5 h-3.5" /> 連携中
                      </span>
                    ) : (
                      <button 
                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                        className="text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1"
                      >
                        <KeyRound className="w-3.5 h-3.5" /> パスワード設定
                      </button>
                    )}
                  </div>

                  {/* パスワード変更フォーム（必要に応じて開閉） */}
                  {isChangingPassword && (
                    <form onSubmit={handleUpdatePassword} className="p-3 bg-pink-50 rounded-2xl border border-pink-200 space-y-2">
                      <p className="text-[11px] font-bold text-gray-700">新しいパスワードを設定する（6文字以上）</p>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="新しいパスワード"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-pink-600 text-white font-bold text-xs rounded-xl shadow-xs"
                        >
                          保存する
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsChangingPassword(false)}
                          className="px-3 py-2 bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                        >
                          キャンセル
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Googleの状態 */}
                  <div className="flex items-center justify-between p-3 bg-pink-50/50 rounded-2xl border border-pink-100">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg> 
                      Google
                    </span>
                    {hasGoogle ? (
                      <span className="text-xs font-bold text-pink-600 flex items-center gap-1 bg-white px-3 py-1 rounded-xl shadow-xs">
                        <Check className="w-3.5 h-3.5" /> 連携中
                      </span>
                    ) : (
                      <button 
                        onClick={handleGoogleAuth}
                        className="text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 px-3 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> ＋連携
                      </button>
                    )}
                  </div>

                  {/* パスワードを忘れた場合の再設定案内 */}
                  <div className="pt-2 text-right">
                    <button
                      onClick={handlePasswordResetEmail}
                      className="text-[11px] text-gray-500 hover:text-pink-600 underline transition"
                    >
                      パスワードを忘れた場合（再設定メール送信）
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-bold text-gray-800">アカウント未登録</p>
                  <p className="text-xs text-gray-400">データを保存するには新規登録してください</p>
                </div>
                <button 
                  onClick={() => setActiveModal("auth")}
                  className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-2xl transition shadow-sm shadow-pink-200"
                >
                  新規登録 / ログイン
                </button>
              </div>
            )}
          </div>
        </div>

        {/* サポートセクション */}
        <div>
          <h2 className="text-pink-600 text-xs font-bold mb-3 uppercase tracking-wider px-1">
            サポート・詳細
          </h2>
          <ul className="bg-white rounded-3xl overflow-hidden shadow-sm border border-pink-100 divide-y divide-pink-50">
            <li>
              <button onClick={() => setActiveModal("guide")} className="w-full text-left p-4 hover:bg-pink-50/50 transition text-sm font-medium flex justify-between items-center">
                <span>使い方ガイド</span>
                <span className="text-gray-400 text-xs">&gt;</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveModal("contact")} className="w-full text-left p-4 hover:bg-pink-50/50 transition text-sm font-medium flex justify-between items-center">
                <span>お問い合わせ・よくある質問</span>
                <span className="text-gray-400 text-xs">&gt;</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveModal("terms")} className="w-full text-left p-4 hover:bg-pink-50/50 transition text-sm font-medium flex justify-between items-center">
                <span>利用規約</span>
                <span className="text-gray-400 text-xs">&gt;</span>
              </button>
            </li>
          </ul>
        </div>

        {/* アプリについて */}
        <div>
          <h2 className="text-pink-600 text-xs font-bold mb-3 uppercase tracking-wider px-1">
            アプリについて
          </h2>
          <ul className="bg-white rounded-3xl overflow-hidden shadow-sm border border-pink-100">
            <li>
              <button onClick={() => setActiveModal("about")} className="w-full text-left p-4 hover:bg-pink-50/50 transition text-sm font-medium flex justify-between items-center">
                <span>アプリのバージョン (v1.0.0)</span>
                <span className="text-gray-400 text-xs">&gt;</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* 各種モーダルをここで呼び出し */}
      <AuthModal
        isOpen={activeModal === "auth"}
        onClose={() => setActiveModal(null)}
        authMode={authMode}
        setAuthMode={setAuthMode}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        handleEmailAuth={handleEmailAuth}
        handleGoogleAuth={handleGoogleAuth}
      />

      <ContactModal
        isOpen={activeModal === "contact"}
        onClose={() => setActiveModal(null)}
        contactEmail={contactEmail}
        setContactEmail={setContactEmail}
        contactMessage={contactMessage}
        setContactMessage={setContactMessage}
        isSubmitting={isSubmitting}
        contactSuccess={contactSuccess}
        handleSendContact={handleSendContact}
      />

      <GuideModal
        isOpen={activeModal === "guide"}
        onClose={() => setActiveModal(null)}
      />

      <TermsModal
        isOpen={activeModal === "terms"}
        onClose={() => setActiveModal(null)}
      />

      {activeModal === "about" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4" onClick={() => setActiveModal(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl text-center space-y-3">
            <h3 className="font-black text-base">JobQuest & 16タイプ診断</h3>
            <p className="text-xs text-gray-400">Version 1.0.0</p>
            <button onClick={() => setActiveModal(null)} className="w-full py-2 bg-gray-100 text-xs font-bold rounded-xl mt-2">閉じる</button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}