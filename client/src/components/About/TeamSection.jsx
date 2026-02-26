import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaChevronRight,
} from "react-icons/fa";
import FadeIn from "./FadeIn";
import { team } from "../../data/about/team";

// This component displays the team members of the company, introducing our key contributors and their roles in a visually appealing way. Each team member is presented with their name, role, bio, avatar, and social media links, arranged in a responsive grid layout that highlights our team's expertise and dedication to transforming agriculture through technology.
function TeamSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <FadeIn className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-widest mb-3">
            <FaChevronRight className="text-green-400" /> The Team
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#073319]">
            Meet the Builders
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
            A passionate group of engineers and researchers dedicated to
            transforming agriculture through technology.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map(({ name, role, bio, avatar, color, social }, i) => (
            <FadeIn key={name} delay={i * 80}>
              <div className="group bg-[#f0fdf4] rounded-2xl p-6 text-center border border-green-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                <div
                  className={`w-16 h-16 rounded-2xl bg-linear-to-br ${color} text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full rounded-2xl object-cover border-4 border-white group-hover:border-green-300 transition-all duration-300"
                  />
                </div>

                <h3 className="font-bold text-[#073319] text-base mb-1">
                  {name}
                </h3>

                <p className="text-green-600 text-xs font-semibold mb-3">
                  {role}
                </p>

                <p className="text-gray-500 text-xs leading-relaxed mb-4 grow">
                  {bio}
                </p>

                <div className="mt-auto flex justify-center gap-3 text-gray-400">
                  <a
                    href={social.github}
                    className="hover:text-gray-700 transition-colors"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href={social.linkedin}
                    className="hover:text-green-600 transition-colors"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href={`mailto:${social.email}`}
                    className="hover:text-green-600 transition-colors"
                  >
                    <FaEnvelope />
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamSection;
