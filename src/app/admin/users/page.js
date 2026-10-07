import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import { User, Enrollment } from "@/models";
import { plain } from "@/lib/utils";
import { setUserRole, deleteUser } from "@/app/actions";
import ConfirmButton from "@/components/ConfirmButton";

export default async function AdminUsers() {
  const session = await getSession();
  await connectDB();
  const users = plain(await User.find().select("-password").sort({ createdAt: -1 }).lean());
  const counts = await Enrollment.aggregate([{ $group: { _id: "$user", n: { $sum: 1 } } }]);
  const map = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));

  return (
    <div>
      <h1 className="mb-5 text-3xl font-extrabold">Users ({users.length})</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr><th className="th">Name</th><th className="th">Email</th><th className="th">Role</th><th className="th">Courses</th><th className="th">Joined</th><th className="th"></th></tr></thead>
          <tbody>
            {users.map((u) => {
              const me = u._id === session.user.id;
              return (
                <tr key={u._id} className="border-t border-line">
                  <td className="td font-semibold">{u.name}{me && <span className="ml-2 text-xs text-mute">(you)</span>}</td>
                  <td className="td">{u.email}</td>
                  <td className="td">{u.role === "admin" ? <span className="chip">Admin</span> : "Student"}</td>
                  <td className="td">{map[u._id] || 0}</td>
                  <td className="td">{new Date(u.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="td">
                    {!me && (
                      <div className="flex justify-end gap-2">
                        <form action={setUserRole}>
                          <input type="hidden" name="id" value={u._id} />
                          <input type="hidden" name="role" value={u.role === "admin" ? "student" : "admin"} />
                          <button className="btn btn-ghost">{u.role === "admin" ? "Make student" : "Make admin"}</button>
                        </form>
                        <form action={deleteUser}>
                          <input type="hidden" name="id" value={u._id} />
                          <ConfirmButton message="Delete this user and their enrollments?">Delete</ConfirmButton>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
