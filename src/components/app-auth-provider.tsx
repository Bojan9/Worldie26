import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";

const macedonianLocalization = {
  locale: "mk-MK",
  socialButtonsBlockButton: "Продолжи со {{provider|titleize}}",
  dividerText: "или",
  formFieldLabel__emailAddress: "Е-пошта",
  formFieldLabel__emailAddress_username: "Е-пошта или корисничко име",
  formFieldLabel__password: "Лозинка",
  formFieldLabel__firstName: "Име",
  formFieldLabel__lastName: "Презиме",
  formFieldInputPlaceholder__emailAddress: "Внесете ја вашата е-пошта",
  formFieldInputPlaceholder__emailAddress_username: "Внесете е-пошта или корисничко име",
  formFieldInputPlaceholder__password: "Внесете ја вашата лозинка",
  formFieldAction__forgotPassword: "Ја заборавивте лозинката?",
  formButtonPrimary: "Продолжи",
  formButtonPrimary__verify: "Потврди",
  backButton: "Назад",
  signIn: {
    start: {
      title: "Најавете се",
      titleCombined: "Продолжете кон Worldie26",
      subtitle: "за да продолжите кон Worldie26",
      subtitleCombined: "Најавете се или креирајте сметка",
      actionText: "Немате сметка?",
      actionLink: "Регистрирајте се",
    },
    password: {
      title: "Внесете ја лозинката",
      subtitle: "Внесете ја лозинката за вашата сметка",
      actionLink: "Користи друг начин",
    },
  },
  signUp: {
    start: {
      title: "Креирајте сметка",
      titleCombined: "Започнете со Worldie26",
      subtitle: "за да започнете со Worldie26",
      subtitleCombined: "Креирајте нова сметка",
      actionText: "Веќе имате сметка?",
      actionLink: "Најавете се",
    },
  },
};

export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return children;
  }

  return (
    <ClerkProvider
      appearance={{ theme: shadcn }}
      localization={macedonianLocalization}
    >
      {children}
    </ClerkProvider>
  );
}
