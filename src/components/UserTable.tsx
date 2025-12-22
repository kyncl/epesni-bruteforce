import { FaDownload } from "react-icons/fa";
import { User } from "../lib/user";
import { downloadUsers } from "../lib/downloadUsers";

export const UserTable = ({ users }: { users: User[] | null }) => {
    // the tailwind done by claude ik wouldn't see that coming
    return (
        <div className="w-full max-w-6xl flex flex-col items-end mx-auto overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl shadow-zinc-200/50 dark:shadow-none">
            <button
                onClick={() => downloadUsers(users)}
                className="p-4 text-xs font-bold uppercase tracking-widest text-right w-fit mr-2"
            >
                <FaDownload />
            </button>
            <div className="w-full">
                <div className="grid grid-cols-8 bg-zinc-50/80 dark:bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
                    <div className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">id</div>
                    <div className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">username</div>
                    <div className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500 col-span-2">e-mail</div>
                    <div className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500 col-span-3">hash</div>
                    <div className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500 text-center">password</div>
                </div>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {users?.map((user) => (
                    <div
                        key={user.id}
                        className="grid grid-cols-8 group hover:bg-indigo-50/30 
                        dark:hover:bg-indigo-500/5 transition-all 
                        duration-200 items-center"
                    >
                        <div className="p-4 text-sm font-mono text-indigo-600 
                        dark:text-indigo-400 font-semibold">
                            #{user.id}
                        </div>
                        <div className="p-4 text-sm font-medium 
                        text-zinc-900 dark:text-zinc-100">
                            {user.username}
                        </div>
                        <div className="p-4 text-sm text-zinc-600 
                        dark:text-zinc-400 col-span-2 italic">
                            {user.email}
                        </div>
                        <div className="p-4 col-span-3 overflow-auto 
                        text-sm text-slate-600 dark:text-slate-300 ">
                            {user.hash}
                        </div>
                        <div className={`p-4 text-sm text-slate-600 
                        dark:text-slate-300 text-center`}>
                            <span className={`${!user.password ? "text-red-500" : "text-green-500"}`}>
                                {user.password ?? "unknown"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
